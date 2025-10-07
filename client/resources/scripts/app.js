// Mock data for users
let users = [
    { id: 1, name: "John Smith", role: "admin" },
    { id: 2, name: "Maria Garcia", role: "restaurant" },
    { id: 3, name: "David Johnson", role: "volunteer" },
    { id: 4, name: "Sarah Wilson", role: "shelter" },
    { id: 5, name: "Mike Chen", role: "restaurant" },
    { id: 6, name: "Lisa Brown", role: "volunteer" }
];

let nextId = 7;
let userToDelete = null;

// Navigation functions
function showLandingPage() {
    hideAllPages();
    document.getElementById('landing-page').style.display = 'block';
}

function showAdminPage() {
    hideAllPages();
    document.getElementById('admin-page').style.display = 'block';
    loadUsersTable();
}

function showRestaurantsPage() {
    hideAllPages();
    document.getElementById('restaurants-page').style.display = 'block';
}

function showVolunteersPage() {
    hideAllPages();
    document.getElementById('volunteers-page').style.display = 'block';
}

function showSheltersPage() {
    hideAllPages();
    document.getElementById('shelters-page').style.display = 'block';
}

function hideAllPages() {
    const pages = ['landing-page', 'admin-page', 'restaurants-page', 'volunteers-page', 'shelters-page'];
    pages.forEach(pageId => {
        document.getElementById(pageId).style.display = 'none';
    });
}

// User management functions
function loadUsersTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <span class="badge bg-${getRoleBadgeColor(user.role)}">${capitalizeFirst(user.role)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getRoleBadgeColor(role) {
    const colors = {
        'admin': 'danger',
        'restaurant': 'primary',
        'volunteer': 'success',
        'shelter': 'warning'
    };
    return colors[role] || 'secondary';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userRole').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userRole').value = user.role;
        
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    }
}

function saveUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value.trim();
    const role = document.getElementById('userRole').value;
    
    if (!name || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    if (id) {
        // Edit existing user
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].role = role;
        }
    } else {
        // Add new user
        const newUser = {
            id: nextId++,
            name: name,
            role: role
        };
        users.push(newUser);
    }
    
    // Close modal and refresh table
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
    loadUsersTable();
}

function deleteUser(id) {
    userToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    if (userToDelete) {
        users = users.filter(u => u.id !== userToDelete);
        userToDelete = null;
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        loadUsersTable();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page by default
    showLandingPage();
});
