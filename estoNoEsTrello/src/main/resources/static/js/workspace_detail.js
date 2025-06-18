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
            listTitleBar.className = 'list-title-bar';
            
            // Block title (soporta title o name)
            const listTitle = document.createElement('div');
            listTitle.className = 'list-title';
            listTitle.textContent = `${list.name}`;

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = "✎";
            editBtn.title = "Edit block name";
            editBtn.className = 'edit-block-title-btn';
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

            listTitleBar.appendChild(listTitle);
            listTitleBar.appendChild(editBtn);
            listDiv.appendChild(listTitleBar);

            // --- Cards ---
            if (Array.isArray(list.cards)) {
                list.cards.forEach((card, cardIdx) => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card';

                    // Card header
                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'card-header';

                    const cardText = document.createElement('span');
                    cardText.className = 'card-text';
                    cardText.textContent = `${card.name}`;

                    // Move arrows
                    const arrows = document.createElement('div');
                    arrows.className = 'card-arrows';

                    const upBtn = document.createElement('button');
                    upBtn.textContent = "↑";
                    upBtn.disabled = cardIdx === 0;
                    upBtn.onclick = e => {
                        e.stopPropagation();
                        moveCard(blockIdx, cardIdx, -1);
                    };

                    const downBtn = document.createElement('button');
                    downBtn.textContent = "↓";
                    downBtn.disabled = cardIdx === list.cards.length - 1;
                    downBtn.onclick = e => {
                        e.stopPropagation();
                        moveCard(blockIdx, cardIdx, 1);
                    };

                    arrows.appendChild(upBtn);
                    arrows.appendChild(downBtn);

                    cardHeader.appendChild(cardText);
                    cardHeader.appendChild(arrows);

                    // Due date
                    const dueDateDiv = document.createElement('div');
                    dueDateDiv.className = 'card-due-date';
                    const dueDate = card.dueDate || card.finalDate;
                    dueDateDiv.textContent = dueDate ? `Finaliza: ${dueDate}` : "Sin fecha de finalización";

                    cardDiv.appendChild(cardHeader);
                    cardDiv.appendChild(dueDateDiv);

                    // Drag & drop and events
                    cardDiv.draggable = true;
                    cardDiv.addEventListener('click', (e) => {
                        if (e.target.closest('.card-arrows')) return;
                        // Use modal management functions
                        if (typeof modals !== 'undefined' && modals.card && modals.card.open) {
                            modals.card.open(blockIdx, cardIdx);
                        }
                    });
                    cardDiv.addEventListener('dragstart', e => {
                        dragged = { blockIdx, cardIdx, cardElem: cardDiv };
                        setTimeout(() => {
                            cardDiv.classList.add('dragging');
                        }, 0);
                    });
                    cardDiv.addEventListener('dragend', e => {
                        cardDiv.classList.remove('dragging');
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
                // Use modal management functions
                if (typeof modals !== 'undefined' && modals.card && modals.card.open) {
                    modals.card.open();
                }
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
    addBlockDiv.innerHTML = `<span class="add-plus">+</span>`;
    addBlockDiv.onclick = function() {
        // Use modal management functions
        if (typeof modals !== 'undefined' && modals.block && modals.block.open) {
            modals.block.open();
        }
    };
    board.appendChild(addBlockDiv);
}

// --- Data loading and initialization ---
document.addEventListener('DOMContentLoaded', function() {
    if(login){
        let pedirBlocks = async() => {
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
                const bloques = await respuesta.json();
                blocks = bloques;
                renderBoard(blocks);
            }
            else{
                alert ("Un error inesperado","No sé que","error");
            }
        }
        pedirBlocks();
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