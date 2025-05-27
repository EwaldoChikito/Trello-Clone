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
    // Formats DD/MM/YYYY into YYYY-MM-DD
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

let blocks = [
    { title: "Pendientes", cards: [
            {title: "Tarea 1", desc: "", createdAt: "01/06/2024", dueDate: "10/06/2024"},
            {title: "Tarea 2", desc: "", createdAt: "02/06/2024", dueDate: "12/06/2024"},
            {title: "Tarea 3", desc: "", createdAt: "03/06/2024", dueDate: "15/06/2024"}
        ] },
    { title: "En Progreso", cards: [
            {title: "Tarea 4", desc: "", createdAt: "04/06/2024", dueDate: "16/06/2024"},
            {title: "Tarea 5", desc: "", createdAt: "05/06/2024", dueDate: "18/06/2024"}
        ] },
    { title: "Completadas", cards: [
            {title: "Tarea 6", desc: "", createdAt: "06/06/2024", dueDate: "20/06/2024"}
        ] }
];

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
        listDiv.innerHTML = `<div class="list-title">${list.title}</div>`;

        list.cards.forEach((card, cardIdx) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.display = "flex";
            cardDiv.style.flexDirection = "column";
            cardDiv.style.justifyContent = "space-between";

            // Preview principal
            const cardHeader = document.createElement('div');
            cardHeader.style.display = "flex";
            cardHeader.style.alignItems = "center";
            cardHeader.style.justifyContent = "space-between";

            const cardText = document.createElement('span');
            cardText.textContent = card.title;
            cardText.style.flex = "1";
            cardText.style.cursor = "pointer";

            // Flechas de mover
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

            // Due Date
            const dueDateDiv = document.createElement('div');
            dueDateDiv.className = 'card-due-date';
            dueDateDiv.textContent = card.dueDate ? `Finaliza: ${card.dueDate}` : "Sin fecha de finalización";

            cardDiv.appendChild(cardHeader);
            cardDiv.appendChild(dueDateDiv);

            // Drag & drop and event listeners
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

        // New Card button
        const addCardDiv = document.createElement('div');
        addCardDiv.className = 'card add-card-ghost';
        addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
        addCardDiv.onclick = function() {
            currentAddBlockIdx = blockIdx;
            openCardModal();
        };
        listDiv.appendChild(addCardDiv);

        // Drag & drop to drop cards into this list
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
}

// Modal logic for creating/editing cards
function openCardModal(blockIdx = null, cardIdx = null) {
    document.getElementById('cardModal').style.display = 'flex';
    const modalTitle = document.querySelector('#cardModal h2');
    const dueDateInput = document.getElementById('cardDueDateInput');
    const createdAtDiv = document.getElementById('cardCreatedAt');
    if (blockIdx !== null && cardIdx !== null) {
        // Addition mode
        editingBlockIdx = blockIdx;
        editingCardIdx = cardIdx;
        const card = blocks[blockIdx].cards[cardIdx];
        document.getElementById('cardTitleInput').value = card.title;
        document.getElementById('cardDescInput').value = card.desc || '';
        // Show due date if exists
        dueDateInput.value = formatDateToYYYYMMDD(card.dueDate);
        createdAtDiv.textContent = card.createdAt ? `Creada: ${card.createdAt}` : '';
        modalTitle.textContent = card.title;
    } else {
        // Create new card mode
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

// Close the modal card
function closeCardModal() {
    document.getElementById('cardModal').style.display = 'none';
}

// Modal form handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createCardForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const title = document.getElementById('cardTitleInput').value.trim();
            const desc = document.getElementById('cardDescInput').value.trim();
            const dueDateRaw = document.getElementById('cardDueDateInput').value; // YYYY-MM-DD
            const dueDate = dueDateRaw ? formatDateToDDMMYYYY(dueDateRaw) : '';
            const today = getTodayFormatted();
            if (title) {
                if (editingBlockIdx !== null && editingCardIdx !== null) {
                    // Edit existing card
                    let card = blocks[editingBlockIdx].cards[editingCardIdx];
                    card.title = title;
                    card.desc = desc;
                    card.dueDate = dueDate;
                    // Does not change createdAt
                } else if (currentAddBlockIdx !== null) {
                    // New card in existing block
                    blocks[currentAddBlockIdx].cards.push({
                        title,
                        desc,
                        createdAt: today,
                        dueDate
                    });
                }
                closeCardModal();
                renderBoard(blocks);
            }
        };
    }
});

renderBoard(blocks);

const userName = "Juan Pérez";
document.getElementById('userName').textContent = userName;
document.title = `Espacio de trabajo de ${userName}`;