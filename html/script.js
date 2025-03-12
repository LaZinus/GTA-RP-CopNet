function login() {
    let loginScreen = document.querySelector(".login-screen")
    loginScreen.style.animation = "slideUp 0.5s ease forwards";
    setTimeout(() => {
        loginScreen.classList.add("hide");
    }, 450)
    document.querySelector(".nav-bar").classList.remove("hide")
    document.querySelector(".apps").classList.remove("hide")
}

function openApp(appName) {
    
}