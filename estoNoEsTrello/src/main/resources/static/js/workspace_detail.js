let blocks = [
    { title: "Pendientes", cards: [{title: "Tarea 1", desc: ""}, {title: "Tarea 2", desc: ""}, {title: "Tarea 3", desc: ""}] },
    { title: "En Progreso", cards: [{title: "Tarea 4", desc: ""}, {title: "Tarea 5", desc: ""}] },
    { title: "Completadas", cards: [{title: "Tarea 6", desc: ""}] }
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
            cardDiv.style.alignItems = "center";
            cardDiv.style.justifyContent = "space-between";

            // Abrir modal en modo edición
            cardDiv.addEventListener('click', (e) => {
                // Evita abrir modal si se hace clic en las flechas
                if (e.target.closest('.card-arrows')) return;
                openCardModal(blockIdx, cardIdx);
            });

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

            cardDiv.appendChild(cardText);
            cardDiv.appendChild(arrows);

            // Drag & drop solo entre bloques
            cardDiv.draggable = true;
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

        // Botón para añadir nueva tarjeta (abre el modal)
        const addCardDiv = document.createElement('div');
        addCardDiv.className = 'card add-card-ghost';
        addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
        addCardDiv.onclick = function() {
            currentAddBlockIdx = blockIdx;
            openCardModal();
        };
        listDiv.appendChild(addCardDiv);

        // Drag & drop solo para soltar tarjetas de otros bloques
        listDiv.addEventListener('dragover', e => {
            e.preventDefault();
        });
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

// Modal lógica
function openCardModal(blockIdx = null, cardIdx = null) {
    document.getElementById('cardModal').style.display = 'flex';
    if (blockIdx !== null && cardIdx !== null) {
        // Modo edición
        editingBlockIdx = blockIdx;
        editingCardIdx = cardIdx;
        const card = blocks[blockIdx].cards[cardIdx];
        document.getElementById('cardTitleInput').value = card.title;
        document.getElementById('cardDescInput').value = card.desc || '';
    } else {
        // Modo crear
        editingBlockIdx = null;
        editingCardIdx = null;
        document.getElementById('cardTitleInput').value = '';
        document.getElementById('cardDescInput').value = '';
    }
    document.getElementById('cardTitleInput').focus();
}
function closeCardModal() {
    document.getElementById('cardModal').style.display = 'none';
}

// Manejar el submit del formulario del modal
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createCardForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const title = document.getElementById('cardTitleInput').value.trim();
            const desc = document.getElementById('cardDescInput').value.trim();
            if (title) {
                if (editingBlockIdx !== null && editingCardIdx !== null) {
                    // Editar tarjeta existente
                    blocks[editingBlockIdx].cards[editingCardIdx] = { title, desc };
                } else if (currentAddBlockIdx !== null) {
                    // Crear nueva tarjeta
                    blocks[currentAddBlockIdx].cards.push({ title, desc });
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