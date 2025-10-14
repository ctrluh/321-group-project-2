using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // In production, this should be hashed
        public string Role { get; set; } = string.Empty; // "Admin", "Restaurant", "Volunteer"
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Restaurant? Restaurant { get; set; }
        public Volunteer? Volunteer { get; set; }
    }

    public class Restaurant
    {
        public int Id { get; set; }
        public int? UserId { get; set; } // Foreign key to User
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string CuisineType { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int TotalDonations { get; set; } = 0;
        public decimal TotalWeightDonated { get; set; } = 0;
        public decimal Rating { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public User? User { get; set; }
    }

    public class Volunteer
    {
        public int Id { get; set; }
        public int? UserId { get; set; } // Foreign key to User
        public string Name { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty; // "Car", "Truck", "Van", "Bicycle"
        public string LicensePlate { get; set; } = string.Empty;
        public string Availability { get; set; } = string.Empty; // "Weekdays", "Weekends", "Evenings", "Flexible"
        public bool IsAvailable { get; set; } = true;
        public int TotalPickups { get; set; } = 0;
        public decimal Rating { get; set; } = 0;
        public string Status { get; set; } = "Active"; // "Active", "Inactive", "Suspended"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public User? User { get; set; }
    }

    public class FoodDonation
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; } // Foreign key to Restaurant
        public int? VolunteerId { get; set; } // Optional - NULL until volunteer accepts
        public string FoodItem { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Weight { get; set; } // in pounds
        public DateTime ExpiryDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Available"; // "Available", "Assigned", "PickedUp", "Completed", "Expired"
        public DateTime? PickupTime { get; set; } // NULL until picked up
        public DateTime? CompletionTime { get; set; } // NULL until completed
        public string PickupLocation { get; set; } = string.Empty;
        public string DeliveryLocation { get; set; } = string.Empty;
        public string SpecialInstructions { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Restaurant? Restaurant { get; set; }
        public Volunteer? Volunteer { get; set; }
    }

    public class PickupRequest
    {
        public int Id { get; set; }
        public int FoodDonationId { get; set; } // Foreign key to FoodDonation
        public int VolunteerId { get; set; } // Foreign key to Volunteer
        public string Status { get; set; } = "Pending"; // "Pending", "Accepted", "InProgress", "Completed", "Cancelled"
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Distance { get; set; } = 0; // in miles
        public int EstimatedDuration { get; set; } = 0; // in minutes
        
        // Navigation properties
        public FoodDonation? FoodDonation { get; set; }
        public Volunteer? Volunteer { get; set; }
    }

    public class Location
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Type { get; set; } = string.Empty; // "restaurant", "shelter", "community_center", "pickup_point"
        public string ContactPerson { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Hours { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // DTOs for API requests/responses
    public class CreateUserDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public string Username { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }

    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class CreateFoodDonationDto
    {
        [Required]
        public int RestaurantId { get; set; }
        [Required]
        public string FoodItem { get; set; } = string.Empty;
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Weight { get; set; }
        [Required]
        public DateTime ExpiryDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string PickupLocation { get; set; } = string.Empty;
        public string SpecialInstructions { get; set; } = string.Empty;
    }

    public class UpdateFoodDonationDto
    {
        public string FoodItem { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Weight { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string PickupLocation { get; set; } = string.Empty;
        public string SpecialInstructions { get; set; } = string.Empty;
    }

    public class CreatePickupRequestDto
    {
        [Required]
        public int FoodDonationId { get; set; }
        [Required]
        public int VolunteerId { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class AcceptPickupRequestDto
    {
        [Required]
        public int PickupRequestId { get; set; }
        [Required]
        public int VolunteerId { get; set; }
    }

    public class CompletePickupDto
    {
        [Required]
        public int PickupRequestId { get; set; }
        [Required]
        public int VolunteerId { get; set; }
        public string DeliveryLocation { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class CreateRestaurantDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Address { get; set; } = string.Empty;
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required]
        public string ContactPerson { get; set; } = string.Empty;
        [Required]
        public string CuisineType { get; set; } = string.Empty;
    }

    public class CreateVolunteerDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string VehicleType { get; set; } = string.Empty;
        [Required]
        public string LicensePlate { get; set; } = string.Empty;
        [Required]
        public string Availability { get; set; } = string.Empty;
    }

    public class CreateLocationDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Address { get; set; } = string.Empty;
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public string Type { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Hours { get; set; } = string.Empty;
    }
}
