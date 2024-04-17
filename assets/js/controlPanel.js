// check if we're authed to begin with
if (localStorage.getItem("authToken") == null) {
    window.location = "login.html";
    throw new Error("Not authed");
}