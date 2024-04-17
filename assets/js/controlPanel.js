// check if we're authed to begin with
if (getToken() == null) {
    window.location = "login.html";
    throw new Error("Not authed");
}