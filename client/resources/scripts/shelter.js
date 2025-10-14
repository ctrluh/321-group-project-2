// Mock data for food requests (removed - shelters no longer request food)

// Mock data for incoming deliveries
let incomingDeliveries = [
    {
        id: 1,
        restaurant: "Mario's Italian Bistro",
        foodItems: "Fresh Bread, Vegetable Soup",
        volunteer: "David Johnson",
        eta: "2:30 PM",
        status: "in-transit",
        weight: 25.5,
        specialInstructions: "Food is still warm"
    },
    {
        id: 2,
        restaurant: "Campus Corner Cafe",
        foodItems: "Sandwiches, Salads",
        volunteer: "Jane Smith",
        eta: "4:00 PM",
        status: "scheduled",
        weight: 18.0,
        specialInstructions: "Please refrigerate immediately"
    }
];

let nextDeliveryId = 3;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadDeliveriesTable();
    updateStats();
});

// Load requests table (removed - shelters no longer request food)

// Load deliveries table
function loadDeliveriesTable() {
    const tbody = document.getElementById('deliveries-table-body');
    tbody.innerHTML = '';
    
    incomingDeliveries.forEach(delivery => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${delivery.id}</td>
            <td>${delivery.restaurant}</td>
            <td>${delivery.foodItems}</td>
            <td>${delivery.volunteer}</td>
            <td>${delivery.eta}</td>
            <td><span class="badge bg-${getDeliveryStatusBadgeColor(delivery.status)}">${capitalizeFirst(delivery.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-info me-2" onclick="viewDeliveryDetails(${delivery.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="confirmDelivery(${delivery.id})" ${delivery.status === 'delivered' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalDeliveries = incomingDeliveries.length;
    const completedDeliveries = incomingDeliveries.filter(d => d.status === 'delivered').length;
    const pendingDeliveries = incomingDeliveries.filter(d => d.status === 'in-transit').length;
    const totalFoodReceived = incomingDeliveries
        .filter(d => d.status === 'delivered')
        .reduce((sum, d) => sum + d.weight, 0);
    
    document.getElementById('totalDeliveries').textContent = totalDeliveries;
    document.getElementById('completedDeliveries').textContent = completedDeliveries;
    document.getElementById('pendingDeliveries').textContent = pendingDeliveries;
    document.getElementById('totalFoodReceived').textContent = totalFoodReceived.toFixed(1);
}

// Get delivery status badge color
function getDeliveryStatusBadgeColor(status) {
    const colors = {
        'scheduled': 'info',
        'in-transit': 'primary',
        'delivered': 'success',
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

// Food request functions removed - shelters no longer request food


// Show shelter registration modal
function showShelterRegistrationModal() {
    const modal = new bootstrap.Modal(document.getElementById('shelterRegistrationModal'));
    modal.show();
}

// Register shelter
function registerShelter() {
    const shelterName = document.getElementById('shelterName').value;
    const shelterType = document.getElementById('shelterType').value;
    const shelterAddress = document.getElementById('shelterAddress').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const capacity = parseInt(document.getElementById('capacity').value) || 0;
    const operatingHours = document.getElementById('operatingHours').value;
    const specialNeeds = document.getElementById('specialNeeds').value;
    
    if (!shelterName || !shelterType || !shelterAddress || !contactPerson || !contactPhone) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In a real application, you would make an API call here
    console.log('Registering shelter:', {
        shelterName, shelterType, shelterAddress, contactPerson, contactPhone, capacity, operatingHours, specialNeeds
    });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('shelterRegistrationModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('shelterRegistrationForm').reset();
    
    // Show success message
    showAlert('Shelter registration submitted successfully! We will contact you soon.', 'success');
}

// Food request functions removed - shelters no longer request food

// View delivery details
function viewDeliveryDetails(deliveryId) {
    const delivery = incomingDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6>Delivery Information</h6>
                <p><strong>Delivery ID:</strong> #${delivery.id}</p>
                <p><strong>Restaurant:</strong> ${delivery.restaurant}</p>
                <p><strong>Food Items:</strong> ${delivery.foodItems}</p>
                <p><strong>Weight:</strong> ${delivery.weight} lbs</p>
            </div>
            <div class="col-md-6">
                <h6>Volunteer Information</h6>
                <p><strong>Volunteer:</strong> ${delivery.volunteer}</p>
                <p><strong>ETA:</strong> ${delivery.eta}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getDeliveryStatusBadgeColor(delivery.status)}">${capitalizeFirst(delivery.status)}</span></p>
            </div>
        </div>
        ${delivery.specialInstructions ? `
        <div class="mt-3">
            <h6>Special Instructions</h6>
            <p class="text-muted">${delivery.specialInstructions}</p>
        </div>
        ` : ''}
    `;
    
    document.getElementById('requestDetailsContent').innerHTML = content;
    
    const modal = new bootstrap.Modal(document.getElementById('requestDetailsModal'));
    modal.show();
}

// Food request functions removed - shelters no longer request food

// Confirm delivery
function confirmDelivery(deliveryId) {
    const delivery = incomingDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;
    
    if (confirm(`Confirm delivery #${deliveryId} as delivered?`)) {
        delivery.status = 'delivered';
        loadDeliveriesTable();
        showAlert('Delivery confirmed!', 'success');
    }
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
document.getElementById('requestFoodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitFoodRequest();
});

document.getElementById('shelterRegistrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    registerShelter();
});
