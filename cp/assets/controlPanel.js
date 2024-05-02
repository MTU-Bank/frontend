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

/*$("#tokenVal").text(`Ваш токен: ${getToken().substring(0, 99)}...`);*/

function loadPrimaryInterface(data) {
    // remove the class for loading
    $(".loadingText").removeClass("loadingText");
    $(".loadingTextContainer").removeClass("loadingTextContainer");
    $(".contentContainerLoading").removeClass("contentContainerLoading");

    $("#welcomeText").text(`Здравствуйте, ${data.FirstName}!`);
}

populateUserData(loadPrimaryInterface);