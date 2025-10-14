# Food Waste Management Database Setup

## Overview
This project uses SQLite database with Entity Framework Core for data persistence. The database is designed to manage food donations, restaurants, volunteers, and pickup requests.

## Database Schema

### Tables

#### Users
- **Id** (Primary Key)
- **Username** - Unique username for login
- **Email** - User email address
- **Password** - User password (should be hashed in production)
- **Role** - User role (Admin, Restaurant, Volunteer)
- **FirstName** - User's first name
- **LastName** - User's last name
- **PhoneNumber** - Contact phone number
- **IsActive** - Whether user account is active
- **CreatedAt** - Account creation timestamp
- **UpdatedAt** - Last update timestamp

#### Restaurants
- **Id** (Primary Key)
- **UserId** (Foreign Key to Users) - Optional user account link
- **Name** - Restaurant name
- **Address** - Restaurant address
- **PhoneNumber** - Restaurant contact number
- **ContactPerson** - Primary contact person
- **CuisineType** - Type of cuisine served
- **IsActive** - Whether restaurant is active
- **TotalDonations** - Count of total donations made
- **TotalWeightDonated** - Total weight of food donated
- **Rating** - Average rating from volunteers
- **CreatedAt** - Restaurant registration timestamp
- **UpdatedAt** - Last update timestamp

#### Volunteers
- **Id** (Primary Key)
- **UserId** (Foreign Key to Users) - User account link
- **Name** - Volunteer name
- **VehicleType** - Type of vehicle (Car, Truck, Van, Bicycle)
- **LicensePlate** - Vehicle license plate
- **Availability** - When volunteer is available
- **IsAvailable** - Current availability status
- **TotalPickups** - Number of pickups completed
- **Rating** - Average rating from restaurants
- **Status** - Volunteer status (Active, Inactive, Suspended)
- **CreatedAt** - Volunteer registration timestamp
- **UpdatedAt** - Last update timestamp

#### FoodDonations
- **Id** (Primary Key)
- **RestaurantId** (Foreign Key to Restaurants)
- **VolunteerId** (Foreign Key to Volunteers) - Optional, assigned when picked up
- **FoodItem** - Name of the food item
- **Quantity** - Number of items
- **Weight** - Weight in pounds
- **ExpiryDate** - When the food expires
- **Description** - Additional description
- **Status** - Donation status (Available, Assigned, PickedUp, Completed, Expired)
- **PickupTime** - When food was picked up
- **CompletionTime** - When delivery was completed
- **PickupLocation** - Where to pick up the food
- **DeliveryLocation** - Where to deliver the food
- **SpecialInstructions** - Any special pickup/delivery instructions
- **CreatedAt** - Donation creation timestamp
- **UpdatedAt** - Last update timestamp

#### PickupRequests
- **Id** (Primary Key)
- **FoodDonationId** (Foreign Key to FoodDonations)
- **VolunteerId** (Foreign Key to Volunteers)
- **Status** - Request status (Pending, Accepted, InProgress, Completed, Cancelled)
- **RequestedAt** - When request was made
- **AcceptedAt** - When volunteer accepted
- **StartedAt** - When pickup started
- **CompletedAt** - When delivery completed
- **Notes** - Additional notes
- **Distance** - Distance in miles
- **EstimatedDuration** - Estimated time in minutes

#### Locations
- **Id** (Primary Key)
- **Name** - Location name
- **Address** - Physical address
- **Latitude** - GPS latitude
- **Longitude** - GPS longitude
- **Type** - Location type (restaurant, shelter, community_center, pickup_point)
- **ContactPerson** - Primary contact
- **PhoneNumber** - Contact number
- **Hours** - Operating hours
- **IsActive** - Whether location is active
- **CreatedAt** - Location creation timestamp
- **UpdatedAt** - Last update timestamp

## Setup Instructions

### 1. Install Required Packages
The following NuGet packages are already included in the project:
- Microsoft.Data.Sqlite (9.0.9)
- Microsoft.EntityFrameworkCore.Sqlite (9.0.9)
- Microsoft.EntityFrameworkCore.Design (9.0.9)

### 2. Database Configuration
The connection string is configured in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=./api/foodwaste.db"
  }
}
```

### 3. Database Initialization
The database is automatically created and seeded when the application starts. The `Program.cs` file includes:
```csharp
// Ensure database is created and seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FoodWasteDbContext>();
    context.Database.EnsureCreated();
}
```

### 4. Seed Data
The database is pre-populated with:
- Admin user (admin/admin123)
- Sample restaurant users
- Sample volunteer users
- Sample restaurants and volunteers
- Sample locations (community centers, shelters)
- Sample food donations

## API Endpoints

### Food Donations
- `GET /api/FoodDonations` - Get all food donations
- `GET /api/FoodDonations/{id}` - Get specific food donation
- `POST /api/FoodDonations` - Create new food donation
- `PUT /api/FoodDonations/{id}` - Update food donation
- `DELETE /api/FoodDonations/{id}` - Delete food donation

### Users
- `GET /api/Users` - Get all users
- `GET /api/Users/{id}` - Get specific user
- `POST /api/Users` - Create new user
- `PUT /api/Users/{id}` - Update user
- `DELETE /api/Users/{id}` - Delete user

## Database File Location
The SQLite database file will be created at: `./api/foodwaste.db`

## Development Notes
- The database is automatically created on first run
- Seed data is included for testing purposes
- In production, passwords should be properly hashed
- Consider adding indexes for better performance on large datasets
- Foreign key relationships are properly configured with appropriate cascade behaviors
