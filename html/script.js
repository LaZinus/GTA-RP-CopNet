function login() {
    let loginScreen = document.querySelector(".login-screen")
    loginScreen.style.animation = "slideUp 0.5s ease forwards";
    setTimeout(() => {
        loginScreen.classList.add("hide");
    }, 450)
    document.querySelector(".nav-bar").classList.remove("hide")
    document.querySelector(".apps").classList.remove("hide")
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.dataset.index);
}

function drop(event) {
    event.preventDefault();
    
    let draggedIndex = event.dataTransfer.getData("text");
    let draggedElement = document.querySelector(`td[data-index='${draggedIndex}']`);
    
    if (event.target.tagName === "TD") {
        let targetElement = event.target;
        
        // Apps tauschen
        let temp = targetElement.innerHTML;
        targetElement.innerHTML = draggedElement.innerHTML;
        draggedElement.innerHTML = temp;
    }
}