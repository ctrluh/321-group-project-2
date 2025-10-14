// Mock data for users
let users = [
    {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@restaurant.com",
        phone: "(205) 555-0101",
        role: "donor",
        status: "active",
        createdAt: "2024-01-15",
        // Donor-specific fields
        restaurantName: "Mama's Italian Kitchen",
        cuisineType: "Italian",
        address: "123 Main St, Tuscaloosa, AL 35401"
    },
    {
        id: 2,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "(205) 555-0102",
        role: "volunteer",
        status: "active",
        createdAt: "2024-01-16",
        // Volunteer-specific fields
        vehicleType: "truck",
        licensePlate: "ABC-123"
    },
    {
        id: 3,
        firstName: "Mike",
        lastName: "Davis",
        email: "mike.davis@shelter.org",
        phone: "(205) 555-0103",
        role: "shelter",
        status: "active",
        createdAt: "2024-01-17",
        // Shelter-specific fields
        shelterName: "Tuscaloosa Community Center",
        shelterType: "homeless",
        address: "456 Oak Ave, Tuscaloosa, AL 35401",
        capacity: 50
    },
    {
        id: 4,
        firstName: "Lisa",
        lastName: "Wilson",
        email: "lisa.wilson@restaurant.com",
        phone: "(205) 555-0104",
        role: "donor",
        status: "inactive",
        createdAt: "2024-01-18",
        // Donor-specific fields
        restaurantName: "Golden Dragon Chinese",
        cuisineType: "Chinese",
        address: "789 Pine St, Tuscaloosa, AL 35401"
    },
    {
        id: 5,
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@email.com",
        phone: "(205) 555-0105",
        role: "volunteer",
        status: "active",
        createdAt: "2024-01-19",
        // Volunteer-specific fields
        vehicleType: "van",
        licensePlate: "XYZ-789"
    }
];

let nextId = 6;
let userToDelete = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAllUsers();
    updateStats();
});

// Load all users table
function loadAllUsers() {
    const tbody = document.getElementById('all-users-table-body');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${getRoleBadgeColor(user.role)}">${capitalizeFirst(user.role)}</span></td>
            <td>${user.phone}</td>
            <td><span class="badge bg-${getStatusBadgeColor(user.status)}">${capitalizeFirst(user.status)}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load donors table
function loadDonors() {
    const tbody = document.getElementById('donors-table-body');
    tbody.innerHTML = '';
    
    const donors = users.filter(user => user.role === 'donor');
    
    donors.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.restaurantName}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td><span class="badge bg-${getStatusBadgeColor(user.status)}">${capitalizeFirst(user.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load volunteers table
function loadVolunteers() {
    const tbody = document.getElementById('volunteers-table-body');
    tbody.innerHTML = '';
    
    const volunteers = users.filter(user => user.role === 'volunteer');
    
    volunteers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${capitalizeFirst(user.vehicleType)}</td>
            <td>${user.licensePlate}</td>
            <td><span class="badge bg-${getStatusBadgeColor(user.status)}">${capitalizeFirst(user.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load shelters table
function loadShelters() {
    const tbody = document.getElementById('shelters-table-body');
    tbody.innerHTML = '';
    
    const shelters = users.filter(user => user.role === 'shelter');
    
    shelters.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.shelterName}</td>
            <td>${capitalizeFirst(user.shelterType)}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.capacity}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalUsers = users.length;
    const totalDonors = users.filter(u => u.role === 'donor').length;
    const totalVolunteers = users.filter(u => u.role === 'volunteer').length;
    const totalShelters = users.filter(u => u.role === 'shelter').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalDonors').textContent = totalDonors;
    document.getElementById('totalVolunteers').textContent = totalVolunteers;
    document.getElementById('totalShelters').textContent = totalShelters;
}

// Get role badge color
function getRoleBadgeColor(role) {
    const colors = {
        'donor': 'success',
        'volunteer': 'info',
        'shelter': 'warning'
    };
    return colors[role] || 'secondary';
}

// Get status badge color
function getStatusBadgeColor(status) {
    const colors = {
        'active': 'success',
        'inactive': 'danger'
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

// Show add user modal
function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
}

// Toggle user-specific fields
function toggleUserFields() {
    const userRole = document.getElementById('userRole').value;
    
    // Hide all specific fields
    document.getElementById('donorFields').style.display = 'none';
    document.getElementById('volunteerFields').style.display = 'none';
    document.getElementById('shelterFields').style.display = 'none';
    
    // Show relevant fields based on role
    if (userRole === 'donor') {
        document.getElementById('donorFields').style.display = 'block';
    } else if (userRole === 'volunteer') {
        document.getElementById('volunteerFields').style.display = 'block';
    } else if (userRole === 'shelter') {
        document.getElementById('shelterFields').style.display = 'block';
    }
}

// Add user
function addUser() {
    const userRole = document.getElementById('userRole').value;
    const userStatus = document.getElementById('userStatus').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (!userRole || !firstName || !lastName || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newUser = {
        id: nextId++,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        role: userRole,
        status: userStatus,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add role-specific fields
    if (userRole === 'donor') {
        newUser.restaurantName = document.getElementById('restaurantName').value;
        newUser.cuisineType = document.getElementById('cuisineType').value;
        newUser.address = document.getElementById('restaurantAddress').value;
    } else if (userRole === 'volunteer') {
        newUser.vehicleType = document.getElementById('vehicleType').value;
        newUser.licensePlate = document.getElementById('licensePlate').value;
    } else if (userRole === 'shelter') {
        newUser.shelterName = document.getElementById('shelterName').value;
        newUser.shelterType = document.getElementById('shelterType').value;
        newUser.address = document.getElementById('shelterAddress').value;
        newUser.capacity = parseInt(document.getElementById('capacity').value) || 0;
    }
    
    users.push(newUser);
    loadAllUsers();
    loadDonors();
    loadVolunteers();
    loadShelters();
    updateStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('addUserForm').reset();
    
    // Show success message
    showAlert('User added successfully!', 'success');
}

// Delete user
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    userToDelete = userId;
    
    // Populate delete confirmation modal
    const userInfo = document.getElementById('deleteUserInfo');
    userInfo.innerHTML = `
        <strong>User:</strong> ${user.firstName} ${user.lastName}<br>
        <strong>Email:</strong> ${user.email}<br>
        <strong>Role:</strong> ${capitalizeFirst(user.role)}<br>
        <strong>Status:</strong> ${capitalizeFirst(user.status)}
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Confirm delete
function confirmDelete() {
    if (userToDelete) {
        users = users.filter(u => u.id !== userToDelete);
        loadAllUsers();
        loadDonors();
        loadVolunteers();
        loadShelters();
        updateStats();
        userToDelete = null;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        // Show success message
        showAlert('User deleted successfully!', 'success');
    }
}

// Refresh users
function refreshUsers() {
    loadAllUsers();
    loadDonors();
    loadVolunteers();
    loadShelters();
    updateStats();
    showAlert('Users refreshed!', 'info');
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
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

// Tab change handlers
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for tab changes
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(event) {
            const target = event.target.getAttribute('data-bs-target');
            
            if (target === '#donors') {
                loadDonors();
            } else if (target === '#volunteers') {
                loadVolunteers();
            } else if (target === '#shelters') {
                loadShelters();
            } else if (target === '#all') {
                loadAllUsers();
            }
        });
    });
});
