function comprobarLogIn()
{
    if (localStorage.getItem("login") !== null)
    {
        return true;
    }
    else
    {
        return false;
    }
}

// Array de boards (puedes reemplazarlo por fetch en el futuro)
let boards = [
//    { title: "Proyecto Web", desc: "Tareas y seguimiento del proyecto web." },
//    { title: "Marketing", desc: "Campañas y estrategias de marketing." },
//    { title: "Personal", desc: "Organiza tus tareas personales." },
//    { title: "Pendings", desc: "Organiza tus tareas personales." },
//    { title: "University", desc: "Organiza tus tareas personales." },
//    { title: "Mamalo Ricardo", desc: "Organiza tus tareas personales." }
];

// Renderiza los boards y el botón de agregar
function renderBoards(boardsToRender) {
    const boardsGrid = document.getElementById('boardsGrid');
    boardsGrid.innerHTML = "";
    boardsToRender.forEach(board => {
        const card = document.createElement('div');
        card.className = 'board-card';
        card.id = board.id; // Asigna el id único del workspace
        card.innerHTML = `
            <div class="board-title">${board.title || board.name}</div>
            <div class="board-desc">${board.desc || board.description}</div>
        `;
        // Ejemplo de eventListener usando el id
//        card.addEventListener('click', () => {
//            console.log('Workspace seleccionado:', card.id);
//            // Aquí puedes manejar la lógica al hacer click
//        });
        boardsGrid.appendChild(card);
    });

    // Botón para agregar nuevo workspace (abre el modal)
    const addCard = document.createElement('div');
    addCard.className = 'board-card add-workspace-card';
    addCard.innerHTML = `<div class="add-plus">+</div><div>Nuevo Workspace</div>`;
    addCard.onclick = function() {
        openWorkspaceModal();
    };
    boardsGrid.appendChild(addCard);
}

// Abre el modal
function openWorkspaceModal() {
    document.getElementById('workspaceModal').style.display = 'flex';
    document.getElementById('workspaceTitleInput').value = '';
    document.getElementById('workspaceDescInput').value = '';
    document.getElementById('workspaceTitleInput').focus();
}

// Cierra el modal
function closeWorkspaceModal() {
    document.getElementById('workspaceModal').style.display = 'none';
}
var name;
var desc;
const emailUser = localStorage.getItem("email");
var login = comprobarLogIn();

const buttonContainer = document.querySelector('.boards-grid') || document.body;
let idSaver = null;

// Maneja el submit del modal
document.addEventListener('DOMContentLoaded', function() {
    if(login){
        let pedirWorkSpaces = async() => {
            event.preventDefault();
            const respuesta = await fetch(`/user/loadWorkSpaces?email=${emailUser}`,
            {
                method: "GET",
                headers:
                {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            });
            if (respuesta.ok)
            {
                const workspaces = await respuesta.json();
                boards = workspaces;
                renderBoards(boards);
            }
            else{
                alert ("Un error inesperado","No sé que","error");
            }
        }

        pedirWorkSpaces();

        const form = document.getElementById('workspaceForm');
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                name = document.getElementById('workspaceTitleInput').value.trim();
                desc = document.getElementById('workspaceDescInput').value.trim() || "Sin descripción.";
                if (name !== "") {

                    let crearWorkSpace = async () => {
                        const workspace = {
                            id: null,
                            name: name,
                            description: desc
                        };
                        let emailUser = localStorage.getItem("email");
                        const petition = await fetch(`/user/createWorkSpace?email=${emailUser}`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(workspace)
                        });
                        if (petition.ok) {
                            const id = await petition.json(); // El backend retorna el id
                            // Agrega el nuevo workspace al array con su id

                            boards.push({
                                id: id,
                                name: name,
                                description: desc
                            });
                            closeWorkspaceModal();
                            renderBoards(boards);
                        } else {
                            const errorRespuesta = await petition.text();
                            alert("Un error inesperado", errorRespuesta, "error");
                        }
                    };

                    crearWorkSpace();
                }
            };
        }

        buttonContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('board-card')) {
                idSaver = event.target.id;
                if(idSaver != ""){
                    localStorage.setItem('workSpaceID',idSaver);
                    window.location.href = "../workspace_detail.html";
                }
            }





        })

    }

//    renderBoards(boards);



    // Filtro de búsqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const filteredBoards = boards.filter(board =>
            (board.name && board.name.toLowerCase().includes(filter)) ||
            (board.description && board.description.toLowerCase().includes(filter))
        );
        renderBoards(filteredBoards);
    });

    // Nombre de usuario dinámico
    const userName = "Juan Pérez"; // se obtiene del backend
    document.getElementById('userName').textContent = userName;
});