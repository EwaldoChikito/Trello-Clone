const blocks = [
    { title: "Pendientes", cards: ["Tarea 1", "Tarea 2", "Tarea 3"] },
    { title: "En Progreso", cards: ["Tarea 4", "Tarea 5"] },
    { title: "Completadas", cards: ["Tarea 6"] }
];

let dragged = { blockIdx: null, cardIdx: null };
let dropIndicator = document.createElement('div');
dropIndicator.className = 'card-drop-indicator';

function clearDropIndicator() {
    if (dropIndicator.parentNode) {
        dropIndicator.parentNode.removeChild(dropIndicator);
    }
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
            cardDiv.textContent = card;
            cardDiv.style.cursor = "pointer";
            cardDiv.draggable = true;

            cardDiv.addEventListener('click', () => {
                alert(`Has hecho clic en: ${card}`);
            });

            cardDiv.addEventListener('dragstart', e => {
                dragged = { blockIdx, cardIdx };
                e.dataTransfer.effectAllowed = "move";
            });

            cardDiv.addEventListener('dragover', e => {
                e.preventDefault();
                if (dropIndicator.parentNode !== cardDiv.parentNode || dropIndicator.nextSibling !== cardDiv) {
                    clearDropIndicator();
                    cardDiv.parentNode.insertBefore(dropIndicator, cardDiv);
                }
            });
            cardDiv.addEventListener('dragleave', e => {
                if (!cardDiv.contains(e.relatedTarget)) {
                    clearDropIndicator();
                }
            });
            cardDiv.addEventListener('drop', e => {
                e.preventDefault();
                clearDropIndicator();
                if (dragged.blockIdx !== null && dragged.cardIdx !== null) {
                    if (dragged.blockIdx === blockIdx && dragged.cardIdx === cardIdx) return;
                    const [cardMoved] = blocks[dragged.blockIdx].cards.splice(dragged.cardIdx, 1);
                    let insertIdx = cardIdx;
                    if (dragged.blockIdx === blockIdx && dragged.cardIdx < cardIdx) {
                        insertIdx--;
                    }
                    blocks[blockIdx].cards.splice(insertIdx, 0, cardMoved);
                    renderBoard(blocks);
                    dragged = { blockIdx: null, cardIdx: null };
                }
            });

            listDiv.appendChild(cardDiv);
        });

        // Tarjeta fantasma para añadir nueva tarjeta
        const addCardDiv = document.createElement('div');
        addCardDiv.className = 'card add-card-ghost';
        addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
        addCardDiv.onclick = function() {
            const name = prompt("Ingrese el nombre de la nueva tarjeta:");
            if (name && name.trim() !== "") {
                list.cards.push(name.trim());
                renderBoard(blocks);
            }
        };
        listDiv.appendChild(addCardDiv);

        listDiv.addEventListener('dragover', e => {
            e.preventDefault();
            if (listDiv.querySelectorAll('.card').length === 1) {
                if (dropIndicator.parentNode !== listDiv) {
                    clearDropIndicator();
                    listDiv.appendChild(dropIndicator);
                }
            }
        });
        listDiv.addEventListener('dragleave', e => {
            if (!listDiv.contains(e.relatedTarget)) {
                clearDropIndicator();
            }
        });
        listDiv.addEventListener('drop', e => {
            e.preventDefault();
            clearDropIndicator();
            if (dragged.blockIdx !== null && dragged.cardIdx !== null) {
                if (dragged.blockIdx === blockIdx) {
                    const [card] = blocks[blockIdx].cards.splice(dragged.cardIdx, 1);
                    blocks[blockIdx].cards.push(card);
                } else {
                    const [card] = blocks[dragged.blockIdx].cards.splice(dragged.cardIdx, 1);
                    blocks[blockIdx].cards.push(card);
                }
                renderBoard(blocks);
                dragged = { blockIdx: null, cardIdx: null };
            }
        });

        board.appendChild(listDiv);
    });
}

renderBoard(blocks);

const userName = "Juan Pérez";
document.getElementById('userName').textContent = userName;
document.title = `Tablero de ${userName}`;