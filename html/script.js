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
    event.dataTransfer.setData("text", event.target.closest("td").dataset.index);
}

function drop(event) {
    event.preventDefault();

    let draggedIndex = event.dataTransfer.getData("text");
    let draggedElement = document.querySelector(`td[data-index='${draggedIndex}']`);

    // Ziel muss entweder ein "app-slot" oder ein "empty-slot" sein
    if (event.target.classList.contains("app-slot") || event.target.classList.contains("empty-slot")) {
        let targetElement = event.target;

        // Falls es ein leerer Platz ist, App dahin verschieben
        let temp = targetElement.innerHTML;
        targetElement.innerHTML = draggedElement.innerHTML;
        draggedElement.innerHTML = temp;

        // Klassen umtauschen, damit die App wirklich wechselt
        if (targetElement.classList.contains("empty-slot")) {
            targetElement.classList.remove("empty-slot");
            targetElement.classList.add("app-slot");
            targetElement.draggable = "true";
            draggedElement.classList.remove("app-slot");
            draggedElement.classList.add("empty-slot");
            draggedElement.draggable = "false";
        }

        // Datenindex umtauschen, damit die Logik stimmt
        let tempIndex = targetElement.dataset.index;
        targetElement.dataset.index = draggedElement.dataset.index;
        draggedElement.dataset.index = tempIndex;
    }
}

// Event Listener für Drop aktivieren
document.querySelectorAll("td").forEach(td => {
    td.ondrop = drop;
    td.ondragover = allowDrop;
});