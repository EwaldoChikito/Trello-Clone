// --- Date utilities ---
function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}
function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}
function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return '';
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

        // Block title
        const listTitle = document.createElement('div');
        listTitle.className = 'list-title';
        listTitle.textContent = list.title;
        listTitle.style.flex = "1";

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = "✎";
        editBtn.title = "Edit block name";
        editBtn.className = 'edit-block-title-btn';
        editBtn.style.marginLeft = "8px";
        editBtn.style.background = "none";
        editBtn.style.border = "none";
        editBtn.style.cursor = "pointer";
        editBtn.style.fontSize = "1.1em";
        editBtn.onclick = function(e) {
            e.stopPropagation();
            // Replace title with input
            const input = document.createElement('input');
            input.type = "text";
            input.value = list.title;
            input.className = "edit-block-title-input";
            input.style.flex = "1";
            input.style.fontSize = "1em";
            input.style.padding = "2px 6px";
            input.style.borderRadius = "6px";
            input.style.border = "1px solid #ccc";
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
            cardText.textContent = card.title;
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

            arrows.appendChild(upBtn);
            arrows.appendChild(downBtn);

            cardHeader.appendChild(cardText);
            cardHeader.appendChild(arrows);

            // Due date
            const dueDateDiv = document.createElement('div');
            dueDateDiv.className = 'card-due-date';
            dueDateDiv.textContent = card.dueDate ? `Finaliza: ${card.dueDate}` : "Sin fecha de finalización";

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

        // Add card button
        const addCardDiv = document.createElement('div');
        addCardDiv.className = 'card add-card-ghost';
        addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
        addCardDiv.onclick = function() {
            currentAddBlockIdx = blockIdx;
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

// Modal logic for create/edit cards
function openCardModal(blockIdx = null, cardIdx = null) {
    document.getElementById('cardModal').style.display = 'flex';
    const modalTitle = document.querySelector('#cardModal h2');
    const dueDateInput = document.getElementById('cardDueDateInput');
    const createdAtDiv = document.getElementById('cardCreatedAt');
    if (blockIdx !== null && cardIdx !== null) {
        editingBlockIdx = blockIdx;
        editingCardIdx = cardIdx;
        const card = blocks[blockIdx].cards[cardIdx];
        document.getElementById('cardTitleInput').value = card.title;
        document.getElementById('cardDescInput').value = card.desc || '';
        dueDateInput.value = formatDateToYYYYMMDD(card.dueDate);
        createdAtDiv.textContent = card.createdAt ? `Creada: ${card.createdAt}` : '';
        modalTitle.textContent = card.title;
    } else {
        editingBlockIdx = null;
        editingCardIdx = null;
        document.getElementById('cardTitleInput').value = '';
        document.getElementById('cardDescInput').value = '';
        dueDateInput.value = '';
        createdAtDiv.textContent = '';
        modalTitle.textContent = "Crear nueva tarjeta";
    }
    document.getElementById('cardTitleInput').focus();
}

function closeCardModal() {
    document.getElementById('cardModal').style.display = 'none';
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
            event.preventDefault();
            const respuesta = await fetch(`/user/loadBlocks?email=${emailUser}`,
                {
                    method: "POST",
                    headers:
                        {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                    body: JSON.stringify(workSpaceID)
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

        const form = document.getElementById('createCardForm');
        if (form) {
            form.onsubmit = async function(e) {
                e.preventDefault();
                const title = document.getElementById('cardTitleInput').value.trim();
                const desc = document.getElementById('cardDescInput').value.trim();
                const dueDateRaw = document.getElementById('cardDueDateInput').value;
                const dueDate = dueDateRaw ? formatDateToDDMMYYYY(dueDateRaw) : '';
                const today = getTodayFormatted();
                if (title !== "") {
                    if (editingBlockIdx !== null && editingCardIdx !== null) {
                        let card = blocks[editingBlockIdx].cards[editingCardIdx];
                        card.title = title;
                        card.desc = desc;
                        card.dueDate = dueDate;
                    } else if (currentAddBlockIdx !== null) {
                        // Crear tarjeta en backend y obtener id
                        const cardData = {
                            title,
                            desc,
                            createdAt: today,
                            dueDate
                        };
                        const petition = await fetch(`/user/createCard?blockId=${blocks[currentAddBlockIdx].id}&email=${emailUser}`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(cardData)
                        });
                        if (petition.ok) {
                            const card = await petition.json();
                            blocks[currentAddBlockIdx].cards.push({
                                id: card.id,
                                title: card.title,
                                desc: card.desc,
                                createdAt: card.createdAt,
                                dueDate: card.dueDate
                            });
                        }
                    }
                    closeCardModal();
                    renderBoard(blocks);
                }
            };
        }

        // --- Handle new block form ---
        const blockForm = document.getElementById('createBlockForm');
        if (blockForm) {
            blockForm.onsubmit = async function(e) {
                e.preventDefault();
                const title = document.getElementById('blockTitleInput').value.trim();
                if (title) {
                    const Block = {
                        id: null,
                        name: title,
                    };
                    const petition = await fetch(`/user/createBlock?email=${emailUser}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(Block)
                    });
                    if (petition.ok) {
                        const block = await petition.json();
                        blocks.push({
                            id: block.id,
                            title: block.name,
                            cards: []
                        });
                        closeBlockModal();
                        renderBoard(blocks);
                    }
                } else {
                    document.getElementById('blockTitleInput').focus();
                }
            };
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