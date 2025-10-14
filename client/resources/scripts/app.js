// Mock data for users
let users = [
    { id: 1, name: "John Smith", role: "admin" },
    { id: 2, name: "Maria Garcia", role: "restaurant" },
    { id: 3, name: "David Johnson", role: "volunteer" },
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

function hideAllPages() {
    const pages = ['landing-page', 'admin-page', 'restaurants-page', 'volunteers-page'];
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
            <td><span class="badge bg-${getRoleBadgeColor(user.role)}">${capitalizeFirst(user.role)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">Delete</button>
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
    };
    return colors[role] || 'secondary';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addUser() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    
    if (!name || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    const newUser = {
        id: nextId++,
        name: name,
        role: role
    };
    
    users.push(newUser);
    loadUsersTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('userForm').reset();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    document.getElementById('userName').value = user.name;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userForm').setAttribute('data-edit-id', id);
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function updateUser() {
    const id = parseInt(document.getElementById('userForm').getAttribute('data-edit-id'));
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    
    if (!name || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].role = role;
        loadUsersTable();
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('userForm').reset();
    document.getElementById('userForm').removeAttribute('data-edit-id');
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    userToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    if (userToDelete) {
        users = users.filter(u => u.id !== userToDelete);
        loadUsersTable();
        userToDelete = null;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
    }
}

// Form submission handler
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isEdit = this.hasAttribute('data-edit-id');
    if (isEdit) {
        updateUser();
    } else {
        addUser();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showLandingPage();
});
