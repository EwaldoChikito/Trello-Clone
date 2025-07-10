// --- Helper functions ---
async function createCard(cardData) {
    const petition = await fetch(`/user/createCard?blockId=${blocks[currentAddBlockIdx].id}&email=${emailUser}&workspaceid=${workSpaceID}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData)
    });
    
    if (petition.ok) {
        // Después de crear, refresca los bloques desde el backend
        await pedirBlocks();
        renderBoard(blocks);
    } else {
        const errorRespuesta = await petition.text();
        alert("Error al crear la tarjeta", errorRespuesta, "error");
    }
}

async function createBlock(blockData) {
    const petition = await fetch(`/user/createBlock?email=${emailUser}&workspaceid=${workSpaceID}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData)
    });
    
    if (petition.ok) {
        // Después de crear, refresca los bloques desde el backend
        await pedirBlocks();
        renderBoard(blocks);
    } else {
        const errorRespuesta = await petition.text();
        alert("Error al crear el bloque", errorRespuesta, "error");
    }
}

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
            
            const desc = document.getElementById('cardDescInput').value.trim();
            const dueDateRaw = document.getElementById('cardDueDateInput').value;
            const today = new Date();
            
            if (editingBlockIdx !== null && editingCardIdx !== null) {
                // Actualizar tarjeta existente
                let card = blocks[editingBlockIdx].cards[editingCardIdx];
                
                // Actualizar propiedades locales
                card.name = title;
                card.title = title;
                card.description = desc;
                card.desc = desc;
                card.finalDate = dueDateRaw;
                card.dueDate = dueDateRaw;

                // Actualizar en el backend
                let cardData = {
                    id: card.id,
                    name: title,
                    description: desc,
                    creationDate: card.creationDate || card.createdAt || today,
                    finalDate: dueDateRaw
                };
                
                const petition = await fetch(`/user/updateCard?blockId=${blocks[editingBlockIdx].id}&workspaceid=${workSpaceID}&email=${emailUser}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cardData)
                });
                
                if (!petition.ok) {
                    const errorRespuesta = await petition.text();
                    alert("Error al actualizar la tarjeta", errorRespuesta, "error");
                }
                modals.card.close();
                renderBoard(blocks);
            } else if (currentAddBlockIdx !== null) {
                // Cierra el modal primero
                modals.card.close();
                // Luego crea la tarjeta y refresca el board
                await createCard({
                    id: null,
                    name: title,
                    description: desc,
                    creationDate: today,
                    finalDate: dueDateRaw
                });
            }
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