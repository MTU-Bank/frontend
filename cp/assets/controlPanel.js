addErrorPopup();

// check if we're authed to begin with
var token = getToken();
if (token == null) {
    window.location = "login.html";
    throw new Error("Not authed");
}

function populateUserData(callback) {
    $.ajax({
        type: 'POST',
        url: APImethod("/api/getCurrentUser"),
        data: '{}',
        beforeSend: function (xhr) { setTokenXHR(xhr, token); },
        success: function (data) {
            if (ProcessDataForErrors(data)) {
                window.location = "login.html";
                throw new Error("Not authed");
            }

            console.log(data);
            localStorage.setItem("user", JSON.stringify(data));
            callback(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });
}

function populateAccountData(callback) {
    $.ajax({
        type: 'GET',
        url: APImethod("/api/listAccounts"),
        beforeSend: function (xhr) { setTokenXHR(xhr, token); },
        success: function (data) {
            if (ProcessDataForErrors(data)) {
                console.log(data);
                window.location = "login.html";
                throw new Error("Not authed");
            }

            console.log(data);
            callback(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });
}

/*$("#tokenVal").text(`Ваш токен: ${getToken().substring(0, 99)}...`);*/

function loadPrimaryInterface(data) {
    // remove the class for loading
    $(".loadingText").removeClass("loadingText");
    $(".loadingTextContainer").removeClass("loadingTextContainer");
    $(".contentContainerLoading").removeClass("contentContainerLoading");

    $("#welcomeText").text(`Здравствуйте, ${data.FirstName}!`);
}

function calculateTotalForCurrency(accounts, currencyIndex) {
    let thisAccount = accounts.filter((z) => z.AccountCurrency == currencyIndex);
    if (thisAccount.length == 0) return 0;
    let sum = 0;
    thisAccount.forEach((z) => sum += z.Balance);
    return sum;
}

function loadAccountInterface(data) {
    // load account information into appropriate fields
    // calculate totals
    var currencies = [ ["RUB", "₽"],
                       ["USD", "$"],
                       ["EUR", "€"] ];
    
    currencies.forEach(element => {
        let signFull = element[0];
        let signShort = element[1];

        let total = calculateTotalForCurrency(data.Accounts, currencies.indexOf(element));
        $(`#balanceInfo_${signFull}`).text(`${(total / 100).toFixed(2)} ${signShort}`);
    });
}

populateUserData(loadPrimaryInterface);
populateAccountData(loadAccountInterface);