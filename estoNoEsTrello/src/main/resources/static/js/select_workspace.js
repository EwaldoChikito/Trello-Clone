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

// Renderiza los boards y el botón de agregar
function renderBoards(boardsToRender) {
    const boardsGrid = document.getElementById('boardsGrid');
    boardsGrid.innerHTML = "";
    boardsToRender.forEach(board => {
        const card = document.createElement('div');
        card.className = 'board-card';
        card.id = board.id;
        card.innerHTML = `
            <div class="board-title">${board.title || board.name}</div>
            <div class="board-desc">${board.desc || board.description}</div>
            <button class="edit-workspace-btn" title="Editar workspace">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>
            <button class="delete-workspace-btn" title="Eliminar workspace">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        `;
        
        // Agregar event listener para el botón de editar
        const editBtn = card.querySelector('.edit-workspace-btn');
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditWorkspaceModal(board);
        });
        
        // Agregar event listener para el botón de eliminar
        const deleteBtn = card.querySelector('.delete-workspace-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('¿Estás seguro de que quieres eliminar este workspace?')) {
                // Encontrar el índice del workspace en el array
                const workspaceIndex = boards.findIndex(ws => ws.id === board.id);
                if (workspaceIndex !== -1) {
                    boards.splice(workspaceIndex, 1);
                    renderBoards(boards);
                }
            }
        });
        
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

// Abre el modal de edición de workspace
function openEditWorkspaceModal(workspace) {
    document.getElementById('editWorkspaceModal').style.display = 'flex';
    document.getElementById('editWorkspaceTitleInput').value = workspace.name || workspace.title || '';
    document.getElementById('editWorkspaceDescInput').value = workspace.description || workspace.desc || '';
    document.getElementById('editWorkspaceTitleInput').focus();
    document.getElementById('editWorkspaceTitleInput').select();
    
    // Guardar referencia al workspace que se está editando
    window.currentEditingWorkspace = workspace;
}

// Cierra el modal de edición de workspace
function closeEditWorkspaceModal() {
    document.getElementById('editWorkspaceModal').style.display = 'none';
    window.currentEditingWorkspace = null;
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

        // Formulario de edición de workspace
        const editWorkspaceForm = document.getElementById('editWorkspaceForm');
        if (editWorkspaceForm) {
            editWorkspaceForm.onsubmit = function(e) {
                e.preventDefault();
                const newName = document.getElementById('editWorkspaceTitleInput').value.trim();
                const newDesc = document.getElementById('editWorkspaceDescInput').value.trim() || "Sin descripción.";
                
                if (newName !== "" && window.currentEditingWorkspace) {
                    // Actualizar el workspace en el array local
                    const workspaceIndex = boards.findIndex(ws => ws.id === window.currentEditingWorkspace.id);
                    if (workspaceIndex !== -1) {
                        boards[workspaceIndex].name = newName;
                        boards[workspaceIndex].description = newDesc;
                        renderBoards(boards);
                    }
                    closeEditWorkspaceModal();
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