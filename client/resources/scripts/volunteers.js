// Volunteer Interface - Adapted from driver functionality for food waste management
class VolunteerInterface {
    constructor() {
        this.currentVolunteer = null;
        this.currentPickup = null;
        this.map = null;
        this.markers = [];
        this.availableDonations = [];
        
        // Check if running from file:// protocol and show helpful message
        if (window.location.protocol === 'file:') {
            this.showAlert('⚠️ For security reasons, browsers block API calls from file:// protocol. Please either:<br>1. Use a local web server (python3 -m http.server 8080)<br>2. Or open the file through a web server', 'warning');
            this.apiBaseUrl = null; // Disable API calls
        } else {
            this.apiBaseUrl = 'http://localhost:5279/api'; // Your food waste API base URL
        }
    }

    // Initialize the volunteer interface
    async init() {
        await this.loadVolunteers();
        this.initializeMap();
        this.setupEventListeners();
    }

    // Load available volunteers from API
    async loadVolunteers() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/Users?role=Volunteer`);
            const volunteers = await response.json();
            
            const select = document.getElementById('volunteer-select');
            select.innerHTML = '<option value="">Select a volunteer...</option>';
            
            volunteers.forEach(volunteer => {
                const option = document.createElement('option');
                option.value = volunteer.id;
                option.textContent = `${volunteer.firstName} ${volunteer.lastName} (${volunteer.email})`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading volunteers:', error);
            this.showAlert('Error loading volunteers. Using mock data.', 'warning');
            this.loadMockVolunteers();
        }
    }

    // Load mock volunteers for development
    loadMockVolunteers() {
        const mockVolunteers = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com' },
            { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@email.com' }
        ];

        const select = document.getElementById('volunteer-select');
        select.innerHTML = '<option value="">Select a volunteer...</option>';
        
        mockVolunteers.forEach(volunteer => {
            const option = document.createElement('option');
            option.value = volunteer.id;
            option.textContent = `${volunteer.firstName} ${volunteer.lastName} (${volunteer.email})`;
            select.appendChild(option);
        });
    }

    // Login as volunteer
    async loginVolunteer() {
        const volunteerId = document.getElementById('volunteer-select').value;
        if (!volunteerId) {
            this.showAlert('Please select a volunteer account.', 'warning');
            return;
        }

        try {
            // In a real application, you would authenticate here
            this.currentVolunteer = { id: volunteerId, name: 'Volunteer User' };
            
            // Hide selection section and show dashboard
            document.getElementById('volunteer-selection-section').style.display = 'none';
            document.getElementById('volunteer-dashboard').style.display = 'block';
            
            // Load volunteer data and available donations
            await this.loadVolunteerData();
            await this.loadAvailableDonations();
            
            this.showAlert('Successfully logged in as volunteer!', 'success');
        } catch (error) {
            console.error('Error logging in volunteer:', error);
            this.showAlert('Error logging in. Please try again.', 'danger');
        }
    }

    // Load volunteer data and statistics
    async loadVolunteerData() {
        try {
            // Mock data for demonstration
            const volunteerData = {
                name: 'John Doe',
                vehicle: 'Honda Civic (ABC123)',
                totalPickups: 15,
                rating: 4.8,
                totalWeight: 125.5,
                avgTime: 25
            };

            document.getElementById('welcomeMessage').textContent = volunteerData.name;
            document.getElementById('vehicleInfo').textContent = volunteerData.vehicle;
            document.getElementById('totalPickups').textContent = volunteerData.totalPickups;
            document.getElementById('rating').textContent = volunteerData.rating;
            document.getElementById('totalWeight').textContent = volunteerData.totalWeight;
            document.getElementById('avgTime').textContent = volunteerData.avgTime;
        } catch (error) {
            console.error('Error loading volunteer data:', error);
        }
    }

    // Load available food donations
    async loadAvailableDonations() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/FoodDonations?status=Available`);
            if (response.ok) {
                this.availableDonations = await response.json();
            } else {
                throw new Error('Failed to fetch donations');
            }
        } catch (error) {
            console.error('Error loading donations:', error);
            // Use mock data for development
            this.availableDonations = [
                {
                    id: 1,
                    restaurantName: "Mario's Italian Bistro",
                    foodItem: "Fresh Bread",
                    weight: 15.5,
                    expiryDate: "2024-01-15",
                    pickupLocation: "123 Main Street, Tuscaloosa, AL"
                },
                {
                    id: 2,
                    restaurantName: "Campus Corner Cafe",
                    foodItem: "Vegetable Soup",
                    weight: 25.0,
                    expiryDate: "2024-01-16",
                    pickupLocation: "456 University Blvd, Tuscaloosa, AL"
                },
                {
                    id: 3,
                    restaurantName: "Downtown Diner",
                    foodItem: "Sandwiches",
                    weight: 12.0,
                    expiryDate: "2024-01-14",
                    pickupLocation: "789 Downtown Ave, Tuscaloosa, AL"
                }
            ];
        }

        this.populateDonationsTable();
        this.updateMap();
    }

    // Load shelter requests
    async loadShelterRequests() {
        try {
            // In a real application, you would fetch from the API
            // const response = await fetch(`${this.apiBaseUrl}/ShelterRequests`);
            // this.shelterRequests = await response.json();
            
            // Mock data for development
            this.shelterRequests = [
                {
                    id: 1,
                    shelterName: "Tuscaloosa Community Center",
                    foodItemsNeeded: "50 sandwiches, 30 salads",
                    estimatedPeople: 100,
                    deliveryDate: "2024-01-16",
                    specialRequirements: "Vegetarian options needed",
                    contactPerson: "Sarah Johnson",
                    contactPhone: "(205) 555-0123"
                },
                {
                    id: 2,
                    shelterName: "Salvation Army Tuscaloosa",
                    foodItemsNeeded: "40 pasta dishes, 25 bread loaves",
                    estimatedPeople: 80,
                    deliveryDate: "2024-01-17",
                    specialRequirements: "No nuts or shellfish",
                    contactPerson: "Mike Davis",
                    contactPhone: "(205) 555-0124"
                }
            ];
        } catch (error) {
            console.error('Error loading shelter requests:', error);
        }
    }

    // Populate the donations table
    populateDonationsTable() {
        const tbody = document.getElementById('available-donations-table');
        tbody.innerHTML = '';

        this.availableDonations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.restaurantName || 'Restaurant'}</td>
                <td>${donation.foodItem}</td>
                <td>${donation.weight} lbs</td>
                <td>${new Date(donation.expiryDate).toLocaleDateString()}</td>
                <td>${donation.pickupLocation}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="volunteerInterface.viewPickupDetails(${donation.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-success" onclick="volunteerInterface.acceptPickup(${donation.id})">
                        <i class="fas fa-check"></i> Accept
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // View pickup details
    viewPickupDetails(donationId) {
        const donation = this.availableDonations.find(d => d.id === donationId);
        if (!donation) return;

        const content = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Pickup Information</h6>
                    <p><strong>Restaurant:</strong> ${donation.restaurantName}</p>
                    <p><strong>Food Item:</strong> ${donation.foodItem}</p>
                    <p><strong>Weight:</strong> ${donation.weight} lbs</p>
                    <p><strong>Expiry Date:</strong> ${new Date(donation.expiryDate).toLocaleDateString()}</p>
                    <p><strong>Pickup Location:</strong> ${donation.pickupLocation}</p>
                </div>
                <div class="col-md-6">
                    <h6>Delivery Information</h6>
                    <p><strong>Suggested Delivery:</strong> Tuscaloosa Community Center</p>
                    <p><strong>Address:</strong> 1000 5th Street, Tuscaloosa, AL 35401</p>
                    <p><strong>Distance:</strong> ~2.5 miles</p>
                    <p><strong>Estimated Time:</strong> 15-20 minutes</p>
                </div>
            </div>
            <div class="mt-3">
                <h6>Special Instructions</h6>
                <p class="text-muted">Please pick up from the back entrance. Food is still warm and should be delivered within 30 minutes.</p>
            </div>
        `;

        document.getElementById('pickup-details-content').innerHTML = content;
        
        // Store current donation for acceptance
        this.currentPickup = donation;
        
        const modal = new bootstrap.Modal(document.getElementById('pickupDetailsModal'));
        modal.show();
    }

    // Accept a pickup
    async acceptPickup(donationId) {
        const donation = this.availableDonations.find(d => d.id === donationId);
        if (!donation) return;

        try {
            // In a real application, you would make an API call here
            this.currentPickup = donation;
            
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('pickupDetailsModal'));
            modal.hide();
            
            // Show current pickup section
            document.getElementById('current-pickup-section').style.display = 'block';
            
            // Update current pickup details
            document.getElementById('current-restaurant').textContent = donation.restaurantName;
            document.getElementById('current-food-item').textContent = donation.foodItem;
            document.getElementById('current-weight').textContent = donation.weight;
            document.getElementById('current-pickup-location').textContent = donation.pickupLocation;
            document.getElementById('current-delivery-location').textContent = 'Tuscaloosa Community Center';
            document.getElementById('current-distance').textContent = '2.5';
            document.getElementById('current-time').textContent = '15-20';
            
            // Update status badge
            document.getElementById('statusBadge').innerHTML = '<i class="fas fa-clock me-1"></i>On Pickup';
            document.getElementById('statusBadge').className = 'badge bg-warning fs-6 mb-2';
            
            this.showAlert('Pickup accepted! Please proceed to the restaurant.', 'success');
        } catch (error) {
            console.error('Error accepting pickup:', error);
            this.showAlert('Error accepting pickup. Please try again.', 'danger');
        }
    }

    // Start pickup process
    startPickup() {
        if (!this.currentPickup) return;

        // Update status
        document.getElementById('statusBadge').innerHTML = '<i class="fas fa-truck me-1"></i>In Transit';
        document.getElementById('statusBadge').className = 'badge bg-info fs-6 mb-2';
        
        this.showAlert('Pickup started! You are now in transit to the restaurant.', 'info');
        
        // In a real application, you would update the pickup status in the database
    }

    // Complete pickup
    completePickup() {
        if (!this.currentPickup) return;

        // Update status
        document.getElementById('statusBadge').innerHTML = '<i class="fas fa-check-circle me-1"></i>Available';
        document.getElementById('statusBadge').className = 'badge bg-success fs-6 mb-2';
        
        // Hide current pickup section
        document.getElementById('current-pickup-section').style.display = 'none';
        
        // Update statistics
        const currentPickups = parseInt(document.getElementById('totalPickups').textContent);
        document.getElementById('totalPickups').textContent = currentPickups + 1;
        
        const currentWeight = parseFloat(document.getElementById('totalWeight').textContent);
        document.getElementById('totalWeight').textContent = (currentWeight + this.currentPickup.weight).toFixed(1);
        
        this.currentPickup = null;
        this.showAlert('Pickup completed successfully! Thank you for your service.', 'success');
        
        // Reload available donations
        this.loadAvailableDonations();
    }

    // Cancel pickup
    cancelPickup() {
        if (!this.currentPickup) return;

        // Reset status
        document.getElementById('statusBadge').innerHTML = '<i class="fas fa-check-circle me-1"></i>Available';
        document.getElementById('statusBadge').className = 'badge bg-success fs-6 mb-2';
        
        // Hide current pickup section
        document.getElementById('current-pickup-section').style.display = 'none';
        
        this.currentPickup = null;
        this.showAlert('Pickup cancelled.', 'warning');
    }

    // Register new volunteer
    async registerVolunteer() {
        // Check if API calls are disabled (file:// protocol)
        if (!this.apiBaseUrl) {
            this.showAlert('API calls are disabled when opening files directly. Please use a web server.', 'danger');
            return;
        }
        
        const form = document.getElementById('volunteerRegistrationForm');
        
        // Get form data
        const fullName = document.getElementById('volunteerName').value.trim();
        const email = document.getElementById('volunteerEmail').value.trim();
        const phoneNumber = document.getElementById('volunteerPhone').value.trim();
        const vehicleType = document.getElementById('vehicleType').value;
        const licensePlate = document.getElementById('licensePlate').value.trim();
        const availability = document.getElementById('availability').value;

        // Validate required fields
        if (!fullName || !email || !phoneNumber || !vehicleType || !licensePlate || !availability) {
            this.showAlert('Please fill in all required fields.', 'warning');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showAlert('Please enter a valid email address.', 'warning');
            return;
        }

        // Split name into first and last
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Volunteer'; // Default last name if not provided

        console.log('Name parts:', { fullName, firstName, lastName });

        // Generate username from email (before @ symbol)
        const username = email.split('@')[0];

        const volunteerData = {
            Username: username,
            Email: email,
            Password: 'volunteer123', // Default password - in production, generate or require
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber,
            VehicleType: vehicleType,
            LicensePlate: licensePlate,
            Availability: availability
        };

        try {
            console.log('Registering volunteer:', volunteerData);
            console.log('API URL:', `${this.apiBaseUrl}/Volunteers`);
            
            // Make API call to register volunteer
            const response = await fetch(`${this.apiBaseUrl}/Volunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(volunteerData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const result = await response.json();
                console.log('Volunteer registered successfully:', result);
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('volunteerRegistrationModal'));
                modal.hide();
                
                // Reset form
                form.reset();
                
                this.showAlert('Volunteer registration successful! You can now log in with your email and password "volunteer123".', 'success');
                
                // Optionally refresh the volunteer list or update UI
                this.loadVolunteers();
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Registration failed:', response.status, errorData);
                this.showAlert(`Registration failed: ${errorData.message || 'Please try again.'}`, 'danger');
            }
        } catch (error) {
            console.error('Error registering volunteer:', error);
            this.showAlert('Error registering volunteer. Please check your connection and try again.', 'danger');
        }
    }

    // Logout volunteer
    logout() {
        this.currentVolunteer = null;
        this.currentPickup = null;
        
        // Hide dashboard and show selection
        document.getElementById('volunteer-dashboard').style.display = 'none';
        document.getElementById('volunteer-selection-section').style.display = 'block';
        document.getElementById('current-pickup-section').style.display = 'none';
        
        // Reset form
        document.getElementById('volunteer-select').value = '';
        
        this.showAlert('Logged out successfully.', 'info');
    }

    // Initialize map
    initializeMap() {
        // Initialize Leaflet map centered on Tuscaloosa
        this.map = L.map('map').setView([33.2098, -87.5692], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    // Update map with pickup locations
    updateMap() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add markers for each available donation
        this.availableDonations.forEach(donation => {
            // Mock coordinates - in a real app, you'd get these from the API
            const coordinates = [
                [33.2098, -87.5692], // Tuscaloosa area
                [33.2015, -87.5623], // Different location
                [33.2174, -87.5467]  // Another location
            ];
            
            const randomCoord = coordinates[Math.floor(Math.random() * coordinates.length)];
            
            const marker = L.marker(randomCoord).addTo(this.map);
            marker.bindPopup(`
                <strong>${donation.restaurantName}</strong><br>
                ${donation.foodItem}<br>
                ${donation.weight} lbs<br>
                <button class="btn btn-sm btn-primary mt-2" onclick="volunteerInterface.acceptPickup(${donation.id})">
                    Accept Pickup
                </button>
            `);
            
            this.markers.push(marker);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submission handlers
        document.getElementById('volunteerRegistrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            volunteerInterface.registerVolunteer();
        });
    }

    // Show alert message
    showAlert(message, type) {
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
}

// Show volunteer registration modal
function showVolunteerRegistration() {
    const modal = new bootstrap.Modal(document.getElementById('volunteerRegistrationModal'));
    modal.show();
}

// Initialize the volunteer interface when page loads
let volunteerInterface;
document.addEventListener('DOMContentLoaded', function() {
    volunteerInterface = new VolunteerInterface();
    volunteerInterface.init();
});
