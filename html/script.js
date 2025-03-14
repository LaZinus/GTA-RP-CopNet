document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("appsTable");
    const slotWidth = 115; // Breite eines Slots (inkl. Gap)
    const slotHeight = 100; // Höhe eines Slots (inkl. Gap)
    const gap = 10; // Abstand zwischen Slots

    function createSlots() {
        table.innerHTML = ""; // Alle bestehenden Slots löschen

        // Breite und Höhe des Containers holen
        const containerWidth = table.parentElement.offsetWidth;
        const containerHeight = table.parentElement.offsetHeight;

        if (containerWidth === 0 || containerHeight === 0) {
            console.warn("Container hat keine sichtbare Größe.");
            return;
        }

        // Anzahl der Spalten und Zeilen berechnen
        const columns = Math.floor((containerWidth + gap) / (slotWidth + gap));
        const rows = Math.floor((containerHeight + gap) / (slotHeight + gap));
        const totalSlots = columns * rows;

        console.log(`Erstelle ${totalSlots} Slots (${columns} Spalten x ${rows} Reihen)`);

        let index = 0; // Startet garantiert bei 0

        for (let row = 0; row < rows; row++) {
            let tr = document.createElement("tr");

            for (let col = 0; col < columns; col++) {
                //test-app
                if (index == 0) {
                    let td = document.createElement("td");
                    td.classList.add("app-slot");
                    td.setAttribute("data-index", index);
                    td.setAttribute("draggable", "true");
                    td.setAttribute('ondragstart', "drag(event)");
                    td.setAttribute("ondrop", "drop(event)");
                    td.setAttribute("ondragover", "allowDrop(event)");
                    td.addEventListener("click", startApp("app-store"))

                    tr.appendChild(td);
                } else {
                    let td = document.createElement("td");
                    td.classList.add("empty-slot");
                    td.setAttribute("data-index", index);
                    td.setAttribute("draggable", "false");
                    td.setAttribute("ondrop", "drop(event)");
                    td.setAttribute("ondragover", "allowDrop(event)");

                    tr.appendChild(td);
                }

                index++; // Zählt sauber weiter

            }

            table.appendChild(tr);
        }
    }

    setTimeout(createSlots, 100); // Verhindert Größenprobleme beim Laden
    window.addEventListener("resize", createSlots); // Aktualisiert die Slots bei Größenänderung
    document.querySelector(".submit").addEventListener("click", function () {
        login();
        setTimeout(() => {
            createSlots();
        }, 450);
    });
});

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

    let emptySlots = document.querySelectorAll(".empty-slot");

    emptySlots.forEach(slot => {
        slot.style.background = "rgba(255, 255, 255, 0.05)"
        slot.style.border = "2px dashed rgba(255, 255, 255, 0.2)"
    })
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
            targetElement.style.border = "none"
            targetElement.addEventListener("mouseover", mouseOver);
            targetElement.addEventListener("mouseout", mouseOut);
            targetElement.setAttribute('draggable', true);
            targetElement.setAttribute('ondragstart', "drag(event)");
            targetElement.setAttribute('ondrop', "drop(event)");
            targetElement.setAttribute('ondragover', "allowDrop(event)");
            draggedElement.classList.remove("app-slot");
            draggedElement.classList.add("empty-slot");
            draggedElement.setAttribute('draggable', false);
            draggedElement.removeAttribute('ondragstart');
            draggedElement.setAttribute('ondrop', "drop(event)");
            draggedElement.setAttribute('ondragover', "allowDrop(event)");
            draggedElement.removeEventListener("mouseover", mouseOver);
            draggedElement.removeEventListener("mouseout", mouseOut);
        }

        // Datenindex umtauschen, damit die Logik stimmt
        let tempIndex = targetElement.dataset.index;
        targetElement.dataset.index = draggedElement.dataset.index;
        draggedElement.dataset.index = tempIndex;

        let emptySlots = document.querySelectorAll(".empty-slot");

        emptySlots.forEach(slot => {
            slot.style.background = "none"
            slot.style.border = "none"
        })
    }
}

// Event Listener für Drop aktivieren
document.querySelectorAll("td").forEach(td => {
    td.ondrop = drop;
    td.ondragover = allowDrop;
});

function mouseOver(event) {
    event.target.style.background = "rgba(255, 255, 255, 0.2)";
}

function mouseOut(event) {
    event.target.style.background = "rgba(255, 255, 255, 0.1)";
}

function startApp(appName) {
    
}