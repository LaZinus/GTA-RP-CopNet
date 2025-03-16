window.addEventListener("message", (event) => {
    const data = event.data;
    const container = document.querySelector('.container');
    const body = document.querySelector('.body');

    switch (data.action) {
        case "opentablet":
            container.classList.remove("hide");
            container.style.animation = "tabletSlideUp 0.5s ease-out forwards";
            body.style.background = "rgba(0,0,0,0.5)";
            break;
        
        case "close_tablet":
            closeTablet();
            break;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("appsTable");

    function createSlots() {
        table.innerHTML = "";

        const slotWidth = 115;
        const slotHeight = 100;
        const gap = 10;
        
        const container = table.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        if (containerWidth === 0 || containerHeight === 0) return;

        const columns = Math.floor((containerWidth + gap) / (slotWidth + gap));
        const rows = Math.floor((containerHeight + gap) / (slotHeight + gap));
        const totalSlots = columns * rows;

        let index = 0;
        for (let row = 0; row < rows; row++) {
            let tr = document.createElement("tr");

            for (let col = 0; col < columns; col++) {
                let td = document.createElement("td");
                td.dataset.index = index;

                if (index === 0) {
                    td.classList.add("app-slot");
                    td.innerHTML = `<img src="./img/app-icon.png" alt="App">`;
                    td.addEventListener("mousedown", startDrag);
                    td.addEventListener("click", () => startApp("app-store"));
                } else {
                    td.classList.add("empty-slot");
                    td.classList.add("hide-app");
                }

                tr.appendChild(td);
                index++;
            }

            table.appendChild(tr);
        }
    }

    setTimeout(createSlots, 100);
    window.addEventListener("resize", createSlots);

    document.querySelector(".submit").addEventListener("click", () => {
        login();
        setTimeout(createSlots, 450);
    });
});

// 📌 Login-Funktion
function login() {
    const loginScreen = document.querySelector(".login-screen");
    loginScreen.style.animation = "slideUp 0.5s ease forwards";
    setTimeout(() => loginScreen.classList.add("hide"), 450);
    
    document.querySelector(".nav-bar").classList.remove("hide");
    document.querySelector(".apps").classList.remove("hide");
}

// 📌 Alternative Drag-and-Drop-Methode für FiveM
let draggedElement = null;
let ghostElement = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(event) {
    draggedElement = event.target.closest("td");

    if (!draggedElement || draggedElement.classList.contains("empty-slot")) return;

    let rect = draggedElement.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    // Ghost-Element erstellen
    ghostElement = draggedElement.cloneNode(true);
    ghostElement.style.position = "absolute";
    ghostElement.style.width = `${rect.width}px`;
    ghostElement.style.height = `${rect.height}px`;
    ghostElement.style.opacity = "0.7";
    ghostElement.style.zIndex = "1000";
    ghostElement.style.pointerEvents = "none"; // Keine Interaktion

    document.body.appendChild(ghostElement);

    document.addEventListener("mousemove", moveElement);
    document.addEventListener("mouseup", stopDrag);

    let emptySlots = document.querySelectorAll(".empty-slot");
    emptySlots.forEach((slot) => {
        slot.classList.remove("hide-app");
    });
}

function moveElement(event) {
    if (!ghostElement) return;

    ghostElement.style.left = `${event.clientX - offsetX}px`;
    ghostElement.style.top = `${event.clientY - offsetY}px`;
}

function stopDrag(event) {
    document.removeEventListener("mousemove", moveElement);
    document.removeEventListener("mouseup", stopDrag);

    let emptySlots = document.querySelectorAll(".empty-slot");
    emptySlots.forEach((slot) => {
        slot.classList.add("hide-app");
    });

    if (!draggedElement || !ghostElement) return;

    let targetElement = document.elementFromPoint(event.clientX, event.clientY)?.closest("td");

    if (targetElement && targetElement !== draggedElement && targetElement.classList.contains("empty-slot")) {
        swapSlots(draggedElement, targetElement);
    }

    // Ghost-Element entfernen
    document.body.removeChild(ghostElement);
    ghostElement = null;
    draggedElement = null;
}

// 🛠 Verbesserte Swap-Funktion
function swapSlots(el1, el2) {
    // Speichere die Referenzen zu den Originalelementen
    let tempContent = el1.innerHTML;
    let tempClass = el1.className;

    el1.innerHTML = el2.innerHTML;
    el1.className = el2.className;

    el2.innerHTML = tempContent;
    el2.className = tempClass;

    // Stelle sicher, dass das Drag-Event wieder hinzugefügt wird
    el1.addEventListener("mousedown", startDrag);
    el2.addEventListener("mousedown", startDrag);
}

// Events für bestehende Slots setzen
document.querySelectorAll("td").forEach(td => {
    td.addEventListener("mousedown", startDrag);
});

// 📌 App starten (noch nicht implementiert)
function startApp(appName) {
    console.log(`App gestartet: ${appName}`);
}

// 📌 Tablet schließen
function closeTablet() {
    const container = document.querySelector(".container");
    const body = document.querySelector(".body");
    const apps = document.querySelector(".apps");
    const loginScreen = document.querySelector(".login-screen");
    const navBar = document.querySelector(".nav-bar");

    container.style.animation = "tabletSlideDown 0.5s ease-out forwards";

    setTimeout(() => {
        container.classList.add("hide");
        body.style.background = "none";
        apps.classList.add("hide");
        loginScreen.classList.remove("hide");
        loginScreen.style.animation = "none";
        navBar.classList.add("hide");

        fetch(`https://${GetParentResourceName()}/tablet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ action: 'closeTablet' })
        }).then(resp => resp.json()).then(resp => console.log(resp.message));
    }, 450);
}

// 📌 ESC-Taste für Tablet schließen
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeTablet();
    }
});