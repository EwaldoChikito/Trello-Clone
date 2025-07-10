// --- Modal management ---
const modals = {
    block: {
        open: () => {
            document.getElementById('blockModal').style.display = 'flex';
            document.getElementById('blockTitleInput').value = '';
            document.getElementById('blockTitleInput').focus();
        },
        close: () => document.getElementById('blockModal').style.display = 'none'
    },
    card: {
        open: (blockIdx = null, cardIdx = null) => {
            const modal = document.getElementById('cardModal');
            const titleInput = document.getElementById('cardTitleInput');
            const descInput = document.getElementById('cardDescInput');
            const dueDateInput = document.getElementById('cardDueDateInput');
            const createdAtDiv = document.getElementById('cardCreatedAt');

            modal.style.display = 'flex';
            editingBlockIdx = blockIdx;
            editingCardIdx = cardIdx;

            if (blockIdx !== null && cardIdx !== null) {
                const card = blocks[blockIdx].cards[cardIdx];
                titleInput.value = card.name || card.title || '';
                descInput.value = card.desc || card.description || '';
                dueDateInput.value = formatDateToYYYYMMDD(card.dueDate || card.finalDate);

                // Handle creation date - check for both properties and format properly
                const creationDate = card.createdAt || card.creationDate;
                if (creationDate) {
                    // If it's a Date object, format it; if it's a string, use as is
                    const formattedDate = creationDate instanceof Date
                        ? creationDate.toLocaleDateString('es-ES')
                        : creationDate;
                    createdAtDiv.textContent = `Creada: ${formattedDate}`;
                } else {
                    createdAtDiv.textContent = '';
                }
                document.querySelector('#cardModal h2').textContent = card.name || card.title || 'Editar tarjeta';
            } else {
                titleInput.value = descInput.value = dueDateInput.value = '';
                createdAtDiv.textContent = '';
                document.querySelector('#cardModal h2').textContent = "Crear nueva tarjeta";
            }
            titleInput.focus();
        },
        close: () => {
            document.getElementById('cardModal').style.display = 'none';
            editingBlockIdx = null;
            editingCardIdx = null;
            currentAddBlockIdx = null;
        }
    }
};


// --- Modal form handlers ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("login")) {
        // Card form handler
        document.getElementById('createCardForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('cardTitleInput').value.trim();
            if (!title) return;
            
            const cardData = {
                id: null,
                name: title,
                description: document.getElementById('cardDescInput').value.trim(),
                creationDate: new Date(),
                finalDate: document.getElementById('cardDueDateInput').value
            };
            
            await createCard(cardData);
            modals.card.close();
        });
        
        // Block form handler
        document.getElementById('createBlockForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('blockTitleInput').value.trim();
            if (!title) {
                document.getElementById('blockTitleInput').focus();
                return;
            }
            
            await createBlock({ id: null, name: title });
            modals.block.close();
        });
    }
});

// --- Create modal elements if they don't exist ---
if (!document.getElementById('blockModal')) {
    const modal = document.createElement('div');
    modal.id = 'blockModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-card">
            <button class="close-modal" onclick="modals.block.close()">×</button>
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

if (!document.getElementById('cardModal')) {
    const modal = document.createElement('div');
    modal.id = 'cardModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-card">
            <button class="close-modal" onclick="modals.card.close()">×</button>
            <h2>Crear nueva tarjeta</h2>
            <form id="createCardForm">
                <label>
                    <input id="cardTitleInput" type="text" placeholder="Título de la tarjeta" required>
                </label>
                <label>
                    <textarea id="cardDescInput" placeholder="Descripción (opcional)"></textarea>
                </label>
                <label>
                    <input id="cardDueDateInput" type="date">
                </label>
                <div id="cardCreatedAt"></div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
} 