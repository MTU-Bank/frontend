addErrorPopup();

function show2FARequest(token) {
    // show a modal window
    $("#twofa-box").removeClass("hidden");
    $("#twofa-box").data("token", token);
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

    // локаем батн
    let currObj = $(this);
    currObj.prop("disabled", true);
    currObj.text("Создаём ваш Личный Кабинет...");

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
            if (ProcessDataForErrors(data)) {
                currObj.prop("disabled", false);
                currObj.text("Создать аккаунт");
                return;
            }

            // assume success!! woo
            // extract token
            setToken(data.Token);
            // redirect to control panel
            window.location = "/cp";
        },
        contentType: "application/json",
        dataType: 'json'
    });
});

// do auth
$("#doLogin").on("click", function() {
    let phone = $("#phonenum").val();
    let pwd = $("#pwd").val();

    if (phone === null || phone == "+" || phone.length < 6) {
        error("Некорректный номер телефона");
        return;
    }
    if (pwd === null || pwd.length == 0) {
        error("Введите пароль!");
        return;
    }

    // лочим кнопку Т_Т
    let currObj = $(this);
    currObj.prop("disabled", true);
    currObj.text("Входим в Личный Кабинет...");

    // делаем запрос с объектом
    let loginObj = {
        Phone: phone,
        Password: pwd
    };
    $.ajax({
        type: 'POST',
        url: APImethod("/api/loginUser"),
        data: JSON.stringify(loginObj),
        success: function(data) {
            if (ProcessDataForErrors(data)) {
                currObj.prop("disabled", false);
                currObj.text("Выполнить вход");
                return;
            }

            // check if 2FA is required
            if (data.TwoFARequired) {
                // show modal window for 2FA
                show2FARequest(data.TwoFAToken);
            } else {
                // successful auth
                // extract token
                setToken(data.Token);
                // redirect to control panel
                window.location = "/cp";
            }
        },
        contentType: "application/json",
        dataType: 'json'
    });
});

// handler for 2FA inputs
$(".twofa-digit").on("input", function (e) {
    let newChar = e.originalEvent.data;
    let val = $(this).val();
    let currentNum = parseInt($(this).attr("num"));

    if (val.length > 1) {
        // only leave the new character
        $(this).val(newChar);
    }

    // move to the next number
    $(`.twofa-digit[num="${currentNum + 1}"]`).focus();
});

$(".twofa-digit").on("paste", function (e) {
    e.stopPropagation();

    let pastedData = e.originalEvent.clipboardData.getData('text');

    if (pastedData.length == 6) {
        // fill it into all the fields
        for (let i = 0; i < 6; i++) {
            $(`.twofa-digit[num="${i + 1}"]`).val(pastedData[i]);
        }
    }
    return false;
});

// confirm 2FA button
$("#check2FA").on("click", function () {
    let token = $(this).parent("#twofa-box").data("token");

    let digits = "";
    $('.twofa-digit').each(function(i, obj) {
        digits += $(obj).val();
    });

    if (digits.length != 6){
        error("Введите 2FA код!");
        return;
    }

    // лок бат
    let currObj = $(this);
    currObj.prop("disabled", true);
    currObj.text("Проверяем код...");

    // делаем запрос
    let fatwo = {
        TwoFAValue: digits
    };
    $.ajax({
        type: 'POST',
        url: APImethod("/api/2FA"),
        data: JSON.stringify(fatwo),
        beforeSend: function (xhr) { setTokenXHR(xhr, token); },
        success: function(data) {
            if (ProcessDataForErrors(data)) {
                currObj.prop("disabled", false);
                currObj.text("Подтвердить вход");
                return;
            }

            // assume success!! yay
            // extract token
            setToken(data.Token);
            // redirect to control panel
            window.location = "/cp";
        },
        contentType: "application/json",
        dataType: 'json'
    });
});