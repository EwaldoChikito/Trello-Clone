// Sample Array of Boards
// This should be replaced with a fetch call from backend
const boards = [
    { title: "Proyecto Web", desc: "Tareas y seguimiento del proyecto web." },
    { title: "Marketing", desc: "Campañas y estrategias de marketing." },
    { title: "Personal", desc: "Organiza tus tareas personales." },
    { title: "Pendings", desc: "Organiza tus tareas personales." },
    { title: "University", desc: "Organiza tus tareas personales." },
    { title: "Mamalo Ricardo", desc: "Organiza tus tareas personales." }
];

let name;

// Renders the boards in the grid as an array of Board objects
function renderBoards(boardsToRender) {
    const boardsGrid = document.getElementById('boardsGrid');
    boardsGrid.innerHTML = "";
    boardsToRender.forEach(board => {
        const card = document.createElement('div');
        card.className = 'board-card';
        card.innerHTML = `
                <div class="board-title">${board.title}</div>
                <div class="board-desc">${board.desc}</div>
            `;
        boardsGrid.appendChild(card);
    });

    // Add a new board card button
    // It permanently stays at the end of the grid
    const addCard = document.createElement('div');
    addCard.className = 'board-card add-workspace-card';
    addCard.innerHTML = `<div class="add-plus">+</div><div>Nuevo Workspace</div>`;
    addCard.onclick = function() {
        name = prompt("Ingrese el nombre del nuevo workspace:");
        if (name && name.trim() !== "") {
            boards.push({ title: name.trim(), desc: "Sin descripción." });
            renderBoards(boards);
        }
    };
    boardsGrid.appendChild(addCard);
}

let workspace = {
    id:
    nombre: name;
    blocks: localStorage.getItem("")
};

// Renders the initial boards
renderBoards(boards);

// Filter the boards based on the search input
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase();
    const filteredBoards = boards.filter(board =>
        board.title.toLowerCase().includes(filter) ||
        board.desc.toLowerCase().includes(filter)
    );
    renderBoards(filteredBoards);
});

// change the username dynamically
const userName = "Juan Pérez"; // we are going to get this from the backend
document.getElementById('userName').textContent = userName;


