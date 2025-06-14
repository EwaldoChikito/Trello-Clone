// --- Date utilities ---
function formatDate(dateStr, toFormat = 'DDMMYYYY') {
    if (!dateStr) return '';
    if (toFormat === 'YYYYMMDD' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    const [part1, part2, part3] = dateStr.split(/[-\/]/);
    return toFormat === 'YYYYMMDD' 
        ? `${part3}-${part2}-${part1}`
        : `${part1}/${part2}/${part3}`;
}

// --- State management ---
const state = {
    blocks: [],
    dragged: { blockIdx: null, cardIdx: null, cardElem: null },
    currentAddBlockIdx: null,
    editingBlockIdx: null,
    editingCardIdx: null
};

const placeholder = Object.assign(document.createElement('div'), {
    className: 'card placeholder'
});

// --- Card operations ---
function moveCard(blockIdx, cardIdx, direction) {
    const cards = state.blocks[blockIdx].cards;
    const newIdx = cardIdx + direction;
    if (newIdx >= 0 && newIdx < cards.length) {
        [cards[cardIdx], cards[newIdx]] = [cards[newIdx], cards[cardIdx]];
        renderBoard();
    }
}

// --- API calls ---
async function fetchBlocks() {
    try {
        const response = await fetch(`/user/loadBlocks?email=${localStorage.getItem('email')}&workspaceid=${localStorage.getItem('workSpaceID')}`, {
            method: "GET",
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        if (response.ok) {
            state.blocks = await response.json();
            renderBoard();
        } else {
            throw new Error('Failed to load blocks');
        }
    } catch (error) {
        alert("Error loading blocks", error.message, "error");
    }
}

async function createCard(cardData) {
    try {
        const response = await fetch(`/user/createCard?blockId=${state.blocks[state.currentAddBlockIdx].id}&email=${localStorage.getItem('email')}&workspaceid=${localStorage.getItem('workSpaceID')}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(cardData)
        });
        
        if (response.ok) {
            const card = await response.json();
            state.blocks[state.currentAddBlockIdx].cards.push({
                id: card.id,
                name: card.name,
                desc: card.description,
                createdAt: card.creationDate,
                dueDate: card.finalDate
            });
            renderBoard();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        alert("Error creating card", error.message, "error");
    }
}

async function createBlock(blockData) {
    try {
        const response = await fetch(`/user/createBlock?email=${localStorage.getItem('email')}&workspaceid=${localStorage.getItem('workSpaceID')}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(blockData)
        });
        
        if (response.ok) {
            const block = await response.json();
            state.blocks.push({
                id: block.id,
                title: block.name,
                cards: []
            });
            renderBoard();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        alert("Error creating block", error.message, "error");
    }
}

// --- Render functions ---
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    state.blocks.forEach((list, blockIdx) => {
        const listDiv = createListElement(list, blockIdx);
        board.appendChild(listDiv);
    });
    
    // Add block button
    board.appendChild(createAddBlockButton());
}

function createListElement(list, blockIdx) {
    const listDiv = document.createElement('div');
    listDiv.className = 'list';
    
    // Title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'list-title-bar';

    // Block title
    const listTitle = document.createElement('div');
    listTitle.className = 'list-title';
    listTitle.textContent = list.title || list.name || "Sin título";

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = "✎";
    editBtn.title = "Edit block name";
    editBtn.className = 'edit-block-title-btn';
    editBtn.onclick = function(e) {
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = "text";
        input.value = list.title || list.name || "";
        input.className = "edit-block-title-input";
        titleBar.replaceChild(input, listTitle);
        input.focus();
        input.select();

        input.onblur = save;
        input.onkeydown = function(ev) {
            if (ev.key === "Enter") {
                save();
            }
        };
        function save() {
            const newTitle = input.value.trim() || "Sin título";
            state.blocks[blockIdx].title = newTitle;
            renderBoard();
        }
    };

    titleBar.appendChild(listTitle);
    titleBar.appendChild(editBtn);
    listDiv.appendChild(titleBar);

    // Cards
    if (Array.isArray(list.cards)) {
        list.cards.forEach((card, cardIdx) => {
            listDiv.appendChild(createCardElement(card, blockIdx, cardIdx));
        });
    }

    // Add card button
    listDiv.appendChild(createAddCardButton(blockIdx));

    // Drag and drop handlers
    setupDragAndDrop(listDiv, blockIdx);

    return listDiv;
}

function createCardElement(card, blockIdx, cardIdx) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const cardText = document.createElement('span');
    cardText.className = 'card-text';
    cardText.textContent = card.title;

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
    downBtn.disabled = cardIdx === state.blocks[blockIdx].cards.length - 1;
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
        modals.card.open(blockIdx, cardIdx);
    });
    cardDiv.addEventListener('dragstart', e => {
        state.dragged = { blockIdx, cardIdx, cardElem: cardDiv };
        setTimeout(() => {
            cardDiv.style.visibility = 'hidden';
        }, 0);
    });
    cardDiv.addEventListener('dragend', e => {
        cardDiv.style.visibility = '';
        clearPlaceholder();
        state.dragged = { blockIdx: null, cardIdx: null, cardElem: null };
    });

    return cardDiv;
}

function createAddCardButton(blockIdx) {
    const addCardDiv = document.createElement('div');
    addCardDiv.className = 'card add-card-ghost';
    addCardDiv.innerHTML = `<span class="add-plus">+</span>`;
    addCardDiv.onclick = function() {
        state.currentAddBlockIdx = blockIdx;
        modals.card.open();
    };
    return addCardDiv;
}

function createAddBlockButton() {
    const addBlockDiv = document.createElement('div');
    addBlockDiv.className = 'list add-block-ghost';
    addBlockDiv.innerHTML = `<span class="add-plus">+</span>`;
    addBlockDiv.onclick = modals.block.open;
    return addBlockDiv;
}

function clearPlaceholder() {
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
}

function setupDragAndDrop(listDiv, blockIdx) {
    listDiv.addEventListener('dragover', e => { e.preventDefault(); });
    listDiv.addEventListener('dragenter', e => {
        if (
            state.dragged.cardElem &&
            state.dragged.blockIdx !== blockIdx &&
            (!placeholder.parentNode || placeholder.parentNode !== listDiv)
        ) {
            clearPlaceholder();
            listDiv.insertBefore(placeholder, createAddCardButton(blockIdx));
        }
    });
    listDiv.addEventListener('dragleave', e => {
        if (!listDiv.contains(e.relatedTarget)) {
            clearPlaceholder();
        }
    });
    listDiv.addEventListener('drop', e => {
        e.preventDefault();
        if (state.dragged.blockIdx !== null && state.dragged.cardIdx !== null && state.dragged.blockIdx !== blockIdx) {
            const [cardMoved] = state.blocks[state.dragged.blockIdx].cards.splice(state.dragged.cardIdx, 1);
            state.blocks[blockIdx].cards.push(cardMoved);
            renderBoard();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("login")) {
        fetchBlocks();
    }
});

// Set user info
const userName = "Juan Pérez";
document.getElementById('userName').textContent = userName;
document.title = `Espacio de trabajo de ${userName}`;