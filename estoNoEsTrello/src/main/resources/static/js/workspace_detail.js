// --- Date utilities ---

function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    // Devuelve en formato yyyy-MM-dd
    return `${year}-${month}-${day}`;
}

//function getTodayFormatted() {
//    const today = new Date();
//    const day = today.getDate();
//    const month = today.getMonth() + 1;
//    const year = today.getFullYear();
//    return `${day}/${month}/${year};
//}

//>>>>>>> 67079d687caad23fa9f905451889096b9a050544
function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}
function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    // Si ya está en formato yyyy-MM-dd, retorna igual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

// --- Initial data with dates in DD/MM/YYYY ---
let blocks = [];

let dragged = { blockIdx: null, cardIdx: null, cardElem: null };
let placeholder = document.createElement('div');
placeholder.className = 'card placeholder';

let currentAddBlockIdx = null;
let editingBlockIdx = null;
let editingCardIdx = null;

// --- Modal logic for creating a new block ---
function openBlockModal() {
    document.getElementById('blockModal').style.display = 'flex';
    document.getElementById('blockTitleInput').value = '';
    document.getElementById('blockTitleInput').focus();
}
function closeBlockModal() {
    document.getElementById('blockModal').style.display = 'none';
}

function clearPlaceholder() {
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
}

function moveCard(blockIdx, cardIdx, direction) {
    const cards = blocks[blockIdx].cards;
    const newIdx = cardIdx + direction;
    if (newIdx < 0 || newIdx >= cards.length) return;
    [cards[cardIdx], cards[newIdx]] = [cards[newIdx], cards[cardIdx]];
    renderBoard(blocks);
}

function renderBoard(blocks) {
        const board = document.getElementById('board');
        board.innerHTML = "";
        blocks.forEach((list, blockIdx) => {
            const listDiv = document.createElement('div');
            listDiv.className = 'list';

            // --- Block title bar and edit button ---
            const listTitleBar = document.createElement('div');
            listTitleBar.style.display = "flex";
            listTitleBar.style.justifyContent = "space-between";
            listTitleBar.style.alignItems = "center";
            console.log(list.name);
            // Block title (soporta title o name)
            const listTitle = document.createElement('div');
            listTitle.className = 'list-title';
            listTitle.textContent = `${list.name}`;
            listTitle.style.flex = "1";

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>`;
            editBtn.title = "Edit block name";
            editBtn.className = 'edit-block-title-btn card1-icon';
            editBtn.onclick = function(e) {
                e.stopPropagation();
                // Replace title with input
                const input = document.createElement('input');
                input.type = "text";
                input.value = list.title || list.name || "";
                input.className = "edit-block-title-input";
                listTitleBar.replaceChild(input, listTitle);
                input.focus();
                input.select();

                // Save on blur or Enter
                input.onblur = save;
                input.onkeydown = function(ev) {
                    if (ev.key === "Enter") {
                        save();
                    }
                };
                function save() {
                    const newTitle = input.value.trim() || "Sin título";
                    blocks[blockIdx].title = newTitle;
                    renderBoard(blocks);
                }
            };

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>`;
            deleteBtn.title = "Delete block";
            deleteBtn.className = 'delete-block-title-btn card1-icon';
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                if (confirm('¿Estás seguro de que quieres eliminar este bloque?')) {
                    // Eliminar del backend primero
                    const block = blocks[blockIdx];
                    
                    if (block && block.id) {
                        const url = `/user/deleteBlock?blockId=${block.id}&workspaceid=${workSpaceID}&email=${emailUser}`;
                        
                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {
                            if (response.ok) {
                                // Si se eliminó correctamente del backend, eliminar visualmente
                                blocks.splice(blockIdx, 1);
                                renderBoard(blocks);
                            } else {
                                alert('Error al eliminar el bloque del servidor');
                            }
                        }).catch(error => {
                            console.error('Error en la petición:', error);
                            alert('Error al eliminar el bloque');
                        });
                    } else {
                        // Si no tiene ID, solo eliminar visualmente (caso de bloques no guardados)
                        blocks.splice(blockIdx, 1);
                        renderBoard(blocks);
                    }
                }
            };


            listTitleBar.appendChild(listTitle);
            listTitleBar.appendChild(editBtn);
            listTitleBar.appendChild(deleteBtn);
            listDiv.appendChild(listTitleBar);

            // --- Cards ---
            console.log(list);
            if (Array.isArray(list.cards)) {
                list.cards.forEach((card, cardIdx) => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card';
                    cardDiv.style.display = "flex";
                    cardDiv.style.flexDirection = "column";
                    cardDiv.style.justifyContent = "space-between";

                    // Card header
                    const cardHeader = document.createElement('div');
                    cardHeader.style.display = "flex";
                    cardHeader.style.alignItems = "center";
                    cardHeader.style.justifyContent = "space-between";

                    const cardText = document.createElement('span');
                    cardText.textContent = card.title || card.name || "Sin título";
                    cardText.style.flex = "1";
                    cardText.style.cursor = "pointer";

                    // Move arrows
                    const arrows = document.createElement('div');
                    arrows.className = 'card-arrows';
                    arrows.style.display = "flex";
                    arrows.style.flexDirection = "column";
                    arrows.style.gap = "2px";

                    const upBtn = document.createElement('button');
                    upBtn.textContent = "↑";
                    upBtn.disabled = cardIdx === 0;
                    upBtn.style.cursor = upBtn.disabled ? "not-allowed" : "pointer";
                    upBtn.onclick = e => {
                        e.stopPropagation();
                        moveCard(blockIdx, cardIdx, -1);
                    };

                    const downBtn = document.createElement('button');
                    downBtn.textContent = "↓";
                    downBtn.disabled = cardIdx === list.cards.length - 1;
                    downBtn.style.cursor = downBtn.disabled ? "not-allowed" : "pointer";
                    downBtn.onclick = e => {
                        e.stopPropagation();
                        moveCard(blockIdx, cardIdx, 1);
                    };

                    // Delete card button
                    const deleteCardBtn = document.createElement('button');
                    deleteCardBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>`;
                    deleteCardBtn.title = "Delete card";
                    deleteCardBtn.className = 'delete-card-btn';
                    deleteCardBtn.onclick = function(e) {
                        e.stopPropagation();
                        if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
                            // Eliminar del backend primero
                            const card = blocks[blockIdx].cards[cardIdx];
                            
                            if (card && card.id) {
                                const url = `/user/deleteCard?cardId=${card.id}&blockId=${blocks[blockIdx].id}&workspaceid=${workSpaceID}&email=${emailUser}`;
                                
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    }
                                }).then(response => {
                                    if (response.ok) {
                                        // Si se eliminó correctamente del backend, eliminar visualmente
                                        blocks[blockIdx].cards.splice(cardIdx, 1);
                                        renderBoard(blocks);
                                    } else {
                                        alert('Error al eliminar la tarjeta del servidor');
                                    }
                                }).catch(error => {
                                    console.error('Error en la petición:', error);
                                    alert('Error al eliminar la tarjeta');
                                });
                            } else {
                                // Si no tiene ID, solo eliminar visualmente (caso de tarjetas no guardadas)
                                blocks[blockIdx].cards.splice(cardIdx, 1);
                                renderBoard(blocks);
                            }
                        }
                    };
                    arrows.appendChild(deleteCardBtn);

                    arrows.appendChild(upBtn);
                    arrows.appendChild(downBtn);

                    cardHeader.appendChild(cardText);
                    cardHeader.appendChild(arrows);

                    // Due date
                    const dueDateDiv = document.createElement('div');
                    dueDateDiv.className = 'card-due-date';
                    dueDateDiv.textContent = card.finalDate ? `Finaliza: ${card.finalDate}` : "Sin fecha de finalización";

                    cardDiv.appendChild(cardHeader);
                    cardDiv.appendChild(dueDateDiv);

                    // Drag & drop and events
                    cardDiv.draggable = true;
                    cardDiv.addEventListener('click', (e) => {
                        if (e.target.closest('.card-arrows')) return;
                        openCardModal(blockIdx, cardIdx);
                    });
                    cardDiv.addEventListener('dragstart', e => {
                        dragged = { blockIdx, cardIdx, cardElem: cardDiv };
                        setTimeout(() => {
                            cardDiv.style.visibility = 'hidden';
                        }, 0);
                    });
                    cardDiv.addEventListener('dragend', e => {
                        cardDiv.style.visibility = '';
                        clearPlaceholder();
                        dragged = { blockIdx: null, cardIdx: null, cardElem: null };
                    });

                    listDiv.appendChild(cardDiv);
                });
            }

            // Add card button
            const addCardDiv = document.createElement('div');
            addCardDiv.className = 'card add-card-ghost';
            addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
            addCardDiv.onclick = function() {
                currentAddBlockIdx = blockIdx; // Solo aquí se setea
                openCardModal();
            };
            listDiv.appendChild(addCardDiv);

            // Drag & drop for dropping cards from other blocks
            listDiv.addEventListener('dragover', e => { e.preventDefault(); });
            listDiv.addEventListener('dragenter', e => {
                if (
                    dragged.cardElem &&
                    dragged.blockIdx !== blockIdx &&
                    (!placeholder.parentNode || placeholder.parentNode !== listDiv)
                ) {
                    clearPlaceholder();
                    listDiv.insertBefore(placeholder, addCardDiv);
                }
            });
            listDiv.addEventListener('dragleave', e => {
                if (!listDiv.contains(e.relatedTarget)) {
                    clearPlaceholder();
                }
            });
            listDiv.addEventListener('drop', e => {
                e.preventDefault();
                if (dragged.blockIdx !== null && dragged.cardIdx !== null && dragged.blockIdx !== blockIdx) {
                    const [cardMoved] = blocks[dragged.blockIdx].cards.splice(dragged.cardIdx, 1);
                    blocks[blockIdx].cards.push(cardMoved);
                    renderBoard(blocks);
                }
            });

            board.appendChild(listDiv);
    });

    // --- Add block ghost button at the end ---
    const addBlockDiv = document.createElement('div');
    addBlockDiv.className = 'list add-block-ghost';
    addBlockDiv.style.display = 'flex';
    addBlockDiv.style.alignItems = 'center';
    addBlockDiv.style.justifyContent = 'center';
    addBlockDiv.style.border = '2px dashed #2a387c';
    addBlockDiv.style.background = 'transparent';
    addBlockDiv.style.color = '#2a387c';
    addBlockDiv.style.cursor = 'pointer';
    addBlockDiv.style.minWidth = '220px';
    addBlockDiv.style.height = '60px';
    addBlockDiv.style.marginLeft = '8px';
    addBlockDiv.innerHTML = `<span class="add-plus" style="font-size:2em;">+</span>`;
    addBlockDiv.onclick = openBlockModal;
    board.appendChild(addBlockDiv);
}

// Modal logic for create/edit cards - using modal_management.js
function openCardModal(blockIdx = null, cardIdx = null) {
    modals.card.open(blockIdx, cardIdx);
}

function closeCardModal() {
    modals.card.close();
}

// --- Modal for new block (add at the end of your HTML if not present) ---
if (!document.getElementById('blockModal')) {
    const modal = document.createElement('div');
    modal.id = 'blockModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-card" style="min-height:180px;">
            <button class="close-modal" onclick="closeBlockModal()">×</button>
            <h2>Crear nuevo bloque</h2>
            <form id="createBlockForm">
                <label>
                    <input id="blockTitleInput" type="text" placeholder="Título del bloque" required>
                </label>
                <button type="submit">Crear</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Modal form handler
document.addEventListener('DOMContentLoaded', function() {
    if(login){

        let pedirBlocks = async() => {
//            event.preventDefault();
            const respuesta = await fetch(`/user/loadBlocks?email=${emailUser}&workspaceid=${workSpaceID}`,
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
                //console.log(respuesta.json());
                const bloques = await respuesta.json();
                blocks = bloques;
                renderBoard(blocks);
            }
            else{
                alert ("Un error inesperado","No sé que","error");
            }
        }
        pedirBlocks();

//        let pedirCards = async() => {
//                    event.preventDefault();
//                    const respuesta = await fetch(`/user/loadCards`?email=${emailUser}&blockId=${blocks[currentAddBlockIdx].id}&workspaceid=${workSpaceID}`,
//                        {
//                            method: "GET",
//                            headers:
//                                {
//                                    "Accept": "application/json",
//                                    "Content-Type": "application/json",
//                                }
//                        });
//                    if (respuesta.ok)
//                    {
//                        const bloques = await respuesta.json();
//                        blocks = bloques;
//                        renderBoard(blocks);
//                    }
//                    else{
//                        alert ("Un error inesperado","No sé que","error");
//                    }
//                }
//                pedirCards();

        // Card form handling is now managed in modal_management.js

        // --- Handle new block form ---
        const blockForm = document.getElementById('createBlockForm');
        if (blockForm) {
            blockForm.onsubmit = async function(e) {
                e.preventDefault();
                const title = document.getElementById('blockTitleInput').value.trim();
                if (title !== "") {

                    let crearBlock = async () => {
                        const Block = {
                            id: null,
                            name: title,
                        };
                        const petition = await fetch(`/user/createBlock?email=${emailUser}&workspaceid=${workSpaceID}`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(Block)
                        });
                        if (petition.ok) {
//                            console.log(petition.json());
                            const text = await petition.text();
                            const block = text ? JSON.parse(text) : null;
                            console.log(block);
                            blocks.push({
                                id: block,
                                name: title,
                                cards: []
                            });
                            closeBlockModal();
                            renderBoard(blocks);
                        }
                        else {
                            const errorRespuesta = await petition.text();
                            alert("CREAR BLOQUE FALLO", errorRespuesta, "error");
                        }
                    }

                    crearBlock();
                    pedirBlocks();


                } else {
                    document.getElementById('blockTitleInput').focus();
                }
            };
            pedirBlocks();
        }
    }
});

renderBoard(blocks);

const userName = "Juan Pérez";
document.getElementById('userName').textContent = userName;
document.title = `Espacio de trabajo de ${userName}`;

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

const emailUser = localStorage.getItem("email");
const workSpaceID = localStorage.getItem("workSpaceID");
var login = comprobarLogIn();