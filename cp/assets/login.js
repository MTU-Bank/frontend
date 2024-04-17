function error(text) {
    $("#alertBoxText").text(text);
    $(".alertBox").removeClass("hiddenAlertBox");
    $(".alertBox").addClass("shownAlertBox");
    setTimeout(hideError, 3000);
}

function hideError() {
    $(".alertBox").removeClass("shownAlertBox");
    $(".alertBox").addClass("hiddenAlertBox");
}

function ProcessDataForErrors(data) {
    if (data.Success != null && data.Success == false) {
        let errorMsg = data.Error;
        if (errorMsg) error(errorMsg);
        return true;
    }
    return false;
}

// handler for phone number input field
var lastPhoneNum = "+";
$(".phonenum").val(lastPhoneNum);
$(".phonenum").on("input", function() {
    // check the stage we're on
    let val = $(this).val();
    if (!val.startsWith("+")) {
        $(this).val(`+${val}`);
    }
    if (val.startsWith("+7")) {
        // Russian phone number! continue.
        // +7 123 345 10 10
        if (val.length > 12) {
            val = val.substring(0, 12);
            $(this).val(val);
        }
    } else {
        // Unknown, leave it up to the user
    }
    lastPhoneNum = val;
});

// change type handler
$(".newAccount").on("click", function() {
    let classes = $("#loginForm").attr('class');

    let shouldRevealRegister = true;
    if (classes) shouldRevealRegister = !classes.includes("hidden");

    if (shouldRevealRegister) {
        $("#loginForm").addClass("hidden");
        $("#registerForm").removeClass("hidden");
    } else {
        $("#loginForm").removeClass("hidden");
        $("#registerForm").addClass("hidden");
    }
});

// ...continue registration...
$("#continueRegister").on("click", function() {
    $("#registerForm_part2").removeClass("hidden");
    $("#registerForm").addClass("hidden");
});

// ...previous step...
$("#prevStep").on("click", function() {
    $("#registerForm_part2").addClass("hidden");
    $("#registerForm").removeClass("hidden");
});

// complete registration!
$("#createAccountBtn").on("click", function() {
    let phone = $("#phonenumReg").val();
    let email = $("#emailReg").val();
    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let mname = $("#mname").val();
    let pwdReg = $("#pwdReg").val();
    let pwdRegRep = $("#pwdRegRep").val();
    let sex = $("#sex").val();

    if (phone === null || phone == "+" || phone.length < 6) {
        error("Некорректный номер телефона");
        return;
    }
    if (email === null || email == '' || !email.includes("@")) {
        error("Адрес электронной почты некорректный");
        return;
    }
    if (fname === null || fname == '') {
        error("Имя некорректно");
        return;
    }
    if (lname === null || lname == '') {
        error("Фамилия некорректна");
        return;
    }
    if (mname === null || mname == '') {
        mname = null;
    }
    if (pwdReg != pwdRegRep) {
        error("Пароли не совпадают");
        return;
    }

    // делаем запрос почему бы и нет
    let registerObject = {
        FirstName: fname,
        MiddleName: mname,
        LastName: lname,
        Email: email,
        PhoneNum: phone,
        Sex: sex,
        Password: pwdReg
    };
    $.ajax({
        type: 'POST',
        url: APImethod("/api/registerUser"),
        data: JSON.stringify(registerObject),
        success: function(data) { 
            if (ProcessDataForErrors(data)) return;
        },
        contentType: "application/json",
        dataType: 'json'
    });
});