// Configuration des produits (récupérée du serveur)
const products = {
    beignets: { name: 'Beignets', price: 100 },
    croquettes: { name: 'Croquettes', price: 100 },
    popCornes: { name: 'Pop-cornes', price: 100 }
};

// État de l'application
let orders = [];
let currentOrder = {
    studentName: '',
    items: {
        beignets: 0,
        croquettes: 0,
        popCornes: 0
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    updateTotal();
    loadOrders();
    updateOrderCounts();
});

// Gestion des onglets
function showTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Masquer tous les boutons d'onglet
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(tabName + 'Section').classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Mettre à jour l'affichage des commandes si nécessaire
    if (tabName === 'pending') {
        displayPendingOrders();
    } else if (tabName === 'completed') {
        displayCompletedOrders();
    }
}

// Chargement des commandes depuis le serveur
async function loadOrders() {
    try {
        const response = await fetch('/api/commandes');
        if (response.ok) {
            orders = await response.json();
            updateOrderCounts();
        }
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
    }
}

// Mise à jour des quantités
function updateQuantity(product, change) {
    currentOrder.items[product] = Math.max(0, currentOrder.items[product] + change);
    document.getElementById(`qty-${product}`).textContent = currentOrder.items[product];
    updateTotal();
}

// Calcul du total
function calculateTotal(items) {
    return Object.entries(items).reduce((total, [item, quantity]) => {
        return total + (products[item].price * quantity);
    }, 0);
}

// Mise à jour de l'affichage du total
function updateTotal() {
    const total = calculateTotal(currentOrder.items);
    document.getElementById('totalAmount').textContent = total + ' FCFA';
    
    // Activer/désactiver le bouton de soumission
    const submitBtn = document.querySelector('.submit-btn');
    const hasItems = Object.values(currentOrder.items).some(qty => qty > 0);
    const hasName = document.getElementById('studentName').value.trim();
    
    if (submitBtn) {
        submitBtn.disabled = !hasItems || !hasName;
    }
}

// Validation en temps réel du nom
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('studentName');
    if (nameInput) {
        nameInput.addEventListener('input', updateTotal);
    }
});

// Soumission d'une commande
async function submitOrder() {
    const studentName = document.getElementById('studentName').value.trim();
    
    if (!studentName) {
        showMessage('Veuillez entrer votre nom', 'error');
        return;
    }
    
    const hasItems = Object.values(currentOrder.items).some(qty => qty > 0);
    if (!hasItems) {
        showMessage('Veuillez sélectionner au moins un article', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    try {
        const response = await fetch('/commander', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName: studentName,
                items: currentOrder.items,
                total: calculateTotal(currentOrder.items)
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            showMessage('Commande envoyée avec succès ! 🎉', 'success');
            resetForm();
            await loadOrders();
            updateOrderCounts();
        } else {
            throw new Error('Erreur serveur');
        }
    } catch (error) {
        showMessage('Erreur lors de l\'envoi de la commande', 'error');
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirmer la Commande';
    }
}

// Affichage des messages
function showMessage(message, type = 'info') {
    // Supprimer l'ancien message s'il existe
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.textContent = message;
    
    // Insérer le message au début du formulaire
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.insertBefore(messageDiv, formContainer.firstChild);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Réinitialisation du formulaire
function resetForm() {
    document.getElementById('studentName').value = '';
    currentOrder.items = { beignets: 0, croquettes: 0, popCornes: 0 };
    
    // Mettre à jour l'affichage des quantités
    Object.keys(products).forEach(product => {
        document.getElementById(`qty-${product}`).textContent = '0';
    });
    
    updateTotal();
}

// Mise à jour des compteurs dans les onglets
function updateOrderCounts() {
    const pendingCount = orders.filter(order => order.status !== 'Livrée').length;
    const completedCount = orders.filter(order => order.status === 'Livrée').length;
    
    const pendingCountEl = document.getElementById('pendingCount');
    const completedCountEl = document.getElementById('completedCount');
    
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
    if (completedCountEl) completedCountEl.textContent = completedCount;
}

// Affichage des commandes en cours
function displayPendingOrders() {
    const container = document.getElementById('pendingOrders');
    if (!container) return;
    
    const pendingOrders = orders.filter(order => order.status !== 'Livrée');
    
    if (pendingOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>Aucune commande en cours</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pendingOrders.map(order => createOrderCard(order)).join('');
}

// Affichage des commandes terminées
function displayCompletedOrders() {
    const container = document.getElementById('completedOrders');
    if (!container) return;
    
    const completedOrders = orders.filter(order => order.status === 'Livrée');
    
    if (completedOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>Aucune commande terminée</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = completedOrders.map(order => createOrderCard(order, true)).join('');
}

// Création d'une carte de commande
function createOrderCard(order, isCompleted = false) {
    const statusClass = getStatusClass(order.status);
    const itemsHtml = Object.entries(order.items)
        .filter(([item, quantity]) => quantity > 0)
        .map(([item, quantity]) => `
            <div class="order-item">
                <span><strong>${products[item].name}</strong></span>
                <span>${quantity} × ${products[item].price} FCFA = <strong>${quantity * products[item].price} FCFA</strong></span>
            </div>
        `).join('');
    
    return `
        <div class="order-card ${isCompleted ? 'completed' : ''}">
            <div class="order-header">
                <div class="order-info">
                    <h3>👤 ${order.studentName}</h3>
                    <div class="timestamp">🕒 ${order.timestamp}</div>
                </div>
                <span class="status-badge ${statusClass}">${order.status}</span>
            </div>
            
            <div class="order-items">
                ${itemsHtml}
            </div>
            
            <div class="order-total">
                💰 Total: ${order.total} FCFA
            </div>
            
            <div class="order-actions">
                ${!isCompleted ? `
                    <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="En attente" ${order.status === 'En attente' ? 'selected' : ''}>⏳ En attente</option>
                        <option value="En préparation" ${order.status === 'En préparation' ? 'selected' : ''}>👨‍🍳 En préparation</option>
                        <option value="Prête" ${order.status === 'Prête' ? 'selected' : ''}>✅ Prête</option>
                        <option value="Livrée" ${order.status === 'Livrée' ? 'selected' : ''}>🚚 Livrée</option>
                    </select>
                ` : ''}
                <button class="delete-btn" onclick="deleteOrder(${order.id})" title="Supprimer la commande">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// Obtenir la classe CSS pour le statut
function getStatusClass(status) {
    switch(status) {
        case 'En attente': return 'status-pending';
        case 'En préparation': return 'status-preparing';
        case 'Prête': return 'status-ready';
        case 'Livrée': return 'status-delivered';
        default: return 'status-pending';
    }
}

// Mise à jour du statut d'une commande
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/api/commandes/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // Mettre à jour l'ordre local
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                updateOrderCounts();
                
                // Rafraîchir l'affichage de l'onglet actuel
                const activeTab = document.querySelector('.tab-btn.active').id.replace('Tab', '');
                if (activeTab === 'pending') {
                    displayPendingOrders();
                } else if (activeTab === 'completed') {
                    displayCompletedOrders();
                }
            }
        } else {
            showMessage('Erreur lors de la mise à jour du statut', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur lors de la mise à jour du statut', 'error');
    }
}

// Suppression d'une commande
async function deleteOrder(orderId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/commandes/${orderId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Supprimer de l'array local
            orders = orders.filter(order => order.id !== orderId);
            updateOrderCounts();
            
            // Rafraîchir l'affichage de l'onglet actuel
            const activeTab = document.querySelector('.tab-btn.active').id.replace('Tab', '');
            if (activeTab === 'pending') {
                displayPendingOrders();
            } else if (activeTab === 'completed') {
                displayCompletedOrders();
            }
            
            showMessage('Commande supprimée avec succès', 'success');
        } else {
            showMessage('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur lors de la suppression', 'error');
    }
}

// Actualisation automatique des commandes toutes les 30 secondes
setInterval(async () => {
    await loadOrders();
    
    // Rafraîchir l'affichage si on est sur un onglet de commandes
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabName = activeTab.id.replace('Tab', '');
        if (tabName === 'pending') {
            displayPendingOrders();
        } else if (tabName === 'completed') {
            displayCompletedOrders();
        }
    }
}, 30000);
