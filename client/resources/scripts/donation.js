// Mock data for food donation orders
let foodDonationOrders = [
    {
        id: 1,
        foodItems: "Fresh Bread, 20 loaves",
        orderDate: "2024-01-15",
        pickupTime: "14:00",
        status: "pending",
        volunteer: null,
        shelterDestination: "Tuscaloosa Community Center",
        quantity: 20,
        weight: 15.5,
        expiryDate: "2024-01-15",
        specialInstructions: "Please pick up from back entrance",
        contactPhone: "(205) 555-0123",
        createdAt: new Date().toISOString(),
        completedDate: null
    },
    {
        id: 2,
        foodItems: "Vegetable Soup, 10 containers",
        orderDate: "2024-01-16",
        pickupTime: "16:30",
        status: "completed",
        volunteer: "David Johnson",
        shelterDestination: "Salvation Army Tuscaloosa",
        quantity: 10,
        weight: 25.0,
        expiryDate: "2024-01-16",
        specialInstructions: "Food will be ready at 4:30 PM",
        contactPhone: "(205) 555-0124",
        createdAt: new Date().toISOString(),
        completedDate: "2024-01-16"
    },
    {
        id: 3,
        foodItems: "Sandwiches, 15 pieces",
        orderDate: "2024-01-14",
        pickupTime: "12:00",
        status: "in-transit",
        volunteer: "Jane Smith",
        shelterDestination: "Tuscaloosa VA Medical Center",
        quantity: 15,
        weight: 12.0,
        expiryDate: "2024-01-14",
        specialInstructions: "Call when arriving",
        contactPhone: "(205) 555-0125",
        createdAt: new Date().toISOString(),
        completedDate: null
    },
    {
        id: 4,
        foodItems: "Pasta Dishes, 25 servings",
        orderDate: "2024-01-10",
        pickupTime: "18:00",
        status: "completed",
        volunteer: "Mike Wilson",
        shelterDestination: "Tuscaloosa Community Center",
        quantity: 25,
        weight: 18.5,
        expiryDate: "2024-01-10",
        specialInstructions: "Delivered successfully",
        contactPhone: "(205) 555-0126",
        createdAt: new Date().toISOString(),
        completedDate: "2024-01-10"
    },
    {
        id: 5,
        foodItems: "Salads, 30 portions",
        orderDate: "2024-01-08",
        pickupTime: "15:30",
        status: "completed",
        volunteer: "Sarah Brown",
        shelterDestination: "Tuscaloosa VA Medical Center",
        quantity: 30,
        weight: 22.0,
        expiryDate: "2024-01-08",
        specialInstructions: "Fresh vegetables",
        contactPhone: "(205) 555-0127",
        createdAt: new Date().toISOString(),
        completedDate: "2024-01-08"
    }
];

let nextId = 4;
let orderToDelete = null;
let orderToEdit = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentOrdersTable();
    loadPastOrdersTable();
    updateStats();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;
});

// Load current orders table (pending, in-transit, etc.)
function loadCurrentOrdersTable() {
    const tbody = document.getElementById('current-orders-table-body');
    tbody.innerHTML = '';
    
    const currentOrders = foodDonationOrders.filter(order => order.status !== 'completed');
    
    currentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.foodItems}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td>${order.pickupTime}</td>
            <td>${order.weight} lbs</td>
            <td><span class="badge bg-${getStatusBadgeColor(order.status)}">${capitalizeFirst(order.status)}</span></td>
            <td>${order.volunteer || 'Not assigned'}</td>
            <td>${order.shelterDestination}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editOrder(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load past orders table (completed orders)
function loadPastOrdersTable() {
    const tbody = document.getElementById('past-orders-table-body');
    tbody.innerHTML = '';
    
    const pastOrders = foodDonationOrders.filter(order => order.status === 'completed');
    
    pastOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.foodItems}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td>${formatDate(order.completedDate)}</td>
            <td>${order.weight} lbs</td>
            <td>${order.volunteer}</td>
            <td>${order.shelterDestination}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalOrders = foodDonationOrders.length;
    const completedPickups = foodDonationOrders.filter(o => o.status === 'completed').length;
    const pendingPickups = foodDonationOrders.filter(o => o.status === 'pending').length;
    const totalWeight = foodDonationOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.weight, 0);
    
    document.getElementById('totalDonations').textContent = totalOrders;
    document.getElementById('completedPickups').textContent = completedPickups;
    document.getElementById('pendingPickups').textContent = pendingPickups;
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(1);
}

// Get status badge color
function getStatusBadgeColor(status) {
    const colors = {
        'pending': 'warning',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Get order status badge color
function getOrderStatusBadgeColor(status) {
    const colors = {
        'pending': 'warning',
        'confirmed': 'info',
        'in-progress': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show add food modal
function showAddFoodModal() {
    const modal = new bootstrap.Modal(document.getElementById('addFoodModal'));
    modal.show();
}

// Add food order
function addFoodOrder() {
    const orderDate = document.getElementById('orderDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const shelterDestination = document.getElementById('shelterDestination').value;
    const foodItems = document.getElementById('foodItems').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const expiryDate = document.getElementById('expiryDate').value;
    const specialInstructions = document.getElementById('specialInstructions').value;
    const contactPhone = document.getElementById('contactPhone').value;
    
    if (!orderDate || !pickupTime || !shelterDestination || !foodItems || !expiryDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newOrder = {
        id: nextId++,
        foodItems: foodItems,
        orderDate: orderDate,
        pickupTime: pickupTime,
        shelterDestination: shelterDestination,
        quantity: quantity,
        weight: weight,
        expiryDate: expiryDate,
        specialInstructions: specialInstructions,
        contactPhone: contactPhone,
        status: 'pending',
        volunteer: null,
        createdAt: new Date().toISOString(),
        completedDate: null
    };
    
    foodDonationOrders.push(newOrder);
    loadCurrentOrdersTable();
    loadPastOrdersTable();
    updateStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addFoodModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('foodForm').reset();
    
    // Show success message
    showAlert('Food order created successfully! A volunteer will be assigned soon.', 'success');
}

// Edit order
function editOrder(id) {
    const order = foodDonationOrders.find(o => o.id === id);
    if (!order) return;
    
    // Populate the form with existing data
    document.getElementById('orderDate').value = order.orderDate;
    document.getElementById('pickupTime').value = order.pickupTime;
    document.getElementById('shelterDestination').value = order.shelterDestination;
    document.getElementById('foodItems').value = order.foodItems;
    document.getElementById('quantity').value = order.quantity;
    document.getElementById('weight').value = order.weight;
    document.getElementById('expiryDate').value = order.expiryDate;
    document.getElementById('specialInstructions').value = order.specialInstructions;
    document.getElementById('contactPhone').value = order.contactPhone;
    
    orderToEdit = id;
    
    const modal = new bootstrap.Modal(document.getElementById('addFoodModal'));
    modal.show();
}

// Update food order
function updateFoodOrder() {
    if (!orderToEdit) return;
    
    const order = foodDonationOrders.find(o => o.id === orderToEdit);
    if (!order) return;
    
    const orderDate = document.getElementById('orderDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const shelterDestination = document.getElementById('shelterDestination').value;
    const foodItems = document.getElementById('foodItems').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const expiryDate = document.getElementById('expiryDate').value;
    const specialInstructions = document.getElementById('specialInstructions').value;
    const contactPhone = document.getElementById('contactPhone').value;
    
    if (!orderDate || !pickupTime || !shelterDestination || !foodItems || !expiryDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    order.orderDate = orderDate;
    order.pickupTime = pickupTime;
    order.shelterDestination = shelterDestination;
    order.foodItems = foodItems;
    order.quantity = quantity;
    order.weight = weight;
    order.expiryDate = expiryDate;
    order.specialInstructions = specialInstructions;
    order.contactPhone = contactPhone;
    
    loadCurrentOrdersTable();
    loadPastOrdersTable();
    updateStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addFoodModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('foodForm').reset();
    orderToEdit = null;
    
    // Show success message
    showAlert('Food order updated successfully!', 'success');
}

// Delete order
function deleteOrder(id) {
    const order = foodDonationOrders.find(o => o.id === id);
    if (!order) return;
    
    orderToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Confirm delete
function confirmDelete() {
    if (orderToDelete) {
        foodDonationOrders = foodDonationOrders.filter(o => o.id !== orderToDelete);
        loadCurrentOrdersTable();
        loadPastOrdersTable();
        updateStats();
        orderToDelete = null;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        // Show success message
        showAlert('Food order deleted successfully!', 'success');
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = foodDonationOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6>Order Information</h6>
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Food Items:</strong> ${order.foodItems}</p>
                <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
                <p><strong>Pickup Time:</strong> ${order.pickupTime}</p>
                <p><strong>Weight:</strong> ${order.weight} lbs</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
            </div>
            <div class="col-md-6">
                <h6>Delivery Information</h6>
                <p><strong>Shelter Destination:</strong> ${order.shelterDestination}</p>
                <p><strong>Volunteer:</strong> ${order.volunteer}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusBadgeColor(order.status)}">${capitalizeFirst(order.status)}</span></p>
                <p><strong>Completed Date:</strong> ${order.completedDate ? formatDate(order.completedDate) : 'Not completed'}</p>
                <p><strong>Contact Phone:</strong> ${order.contactPhone}</p>
            </div>
        </div>
        ${order.specialInstructions ? `
        <div class="mt-3">
            <h6>Special Instructions</h6>
            <p class="text-muted">${order.specialInstructions}</p>
        </div>
        ` : ''}
    `;
    
    // Create a temporary modal for order details
    const modalHtml = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-info-circle me-2"></i>Order Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('orderDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

// Form submission handlers
document.getElementById('foodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (orderToEdit) {
        updateFoodOrder();
    } else {
        addFoodOrder();
    }
});
