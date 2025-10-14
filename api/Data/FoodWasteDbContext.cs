using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
    public class FoodWasteDbContext : DbContext
    {
        public FoodWasteDbContext(DbContextOptions<FoodWasteDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<FoodDonation> FoodDonations { get; set; }
        public DbSet<PickupRequest> PickupRequests { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<FoodDonation>()
                .HasOne(f => f.Restaurant)
                .WithMany()
                .HasForeignKey(f => f.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FoodDonation>()
                .HasOne(f => f.Volunteer)
                .WithMany()
                .HasForeignKey(f => f.VolunteerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PickupRequest>()
                .HasOne(p => p.FoodDonation)
                .WithMany()
                .HasForeignKey(p => p.FoodDonationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PickupRequest>()
                .HasOne(p => p.Volunteer)
                .WithMany()
                .HasForeignKey(p => p.VolunteerId)
                .OnDelete(DeleteBehavior.Restrict);

            // User relationships
            modelBuilder.Entity<Restaurant>()
                .HasOne(r => r.User)
                .WithOne(u => u.Restaurant)
                .HasForeignKey<Restaurant>(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Volunteer>()
                .HasOne(v => v.User)
                .WithOne(u => u.Volunteer)
                .HasForeignKey<Volunteer>(v => v.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed initial data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@leveragingleftovers.com",
                    Password = "admin123",
                    Role = "Admin",
                    FirstName = "System",
                    LastName = "Administrator",
                    PhoneNumber = "205-555-0001",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    Username = "restaurant1",
                    Email = "contact@mariositalian.com",
                    Password = "restaurant123",
                    Role = "Restaurant",
                    FirstName = "Mario",
                    LastName = "Rossi",
                    PhoneNumber = "205-555-0002",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 3,
                    Username = "volunteer1",
                    Email = "john.doe@email.com",
                    Password = "volunteer123",
                    Role = "Volunteer",
                    FirstName = "John",
                    LastName = "Doe",
                    PhoneNumber = "205-555-0003",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant
                {
                    Id = 1,
                    UserId = 2,
                    Name = "Mario's Italian Bistro",
                    Address = "123 Main Street, Tuscaloosa, AL 35401",
                    PhoneNumber = "205-555-0101",
                    ContactPerson = "Mario Rossi",
                    CuisineType = "Italian",
                    IsActive = true,
                    TotalDonations = 15,
                    TotalWeightDonated = 125.5m,
                    Rating = 4.8m,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Restaurant
                {
                    Id = 2,
                    UserId = null,
                    Name = "Campus Corner Cafe",
                    Address = "456 University Blvd, Tuscaloosa, AL 35401",
                    PhoneNumber = "205-555-0102",
                    ContactPerson = "Sarah Johnson",
                    CuisineType = "American",
                    IsActive = true,
                    TotalDonations = 8,
                    TotalWeightDonated = 67.2m,
                    Rating = 4.6m,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<Volunteer>().HasData(
                new Volunteer
                {
                    Id = 1,
                    UserId = 3,
                    Name = "John Doe",
                    VehicleType = "Car",
                    LicensePlate = "ABC123",
                    Availability = "Evenings",
                    IsAvailable = true,
                    TotalPickups = 12,
                    Rating = 4.9m,
                    Status = "Active",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Volunteer
                {
                    Id = 2,
                    UserId = null,
                    Name = "Jane Smith",
                    VehicleType = "Truck",
                    LicensePlate = "XYZ789",
                    Availability = "Weekends",
                    IsAvailable = true,
                    TotalPickups = 8,
                    Rating = 4.7m,
                    Status = "Active",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<Location>().HasData(
                new Location
                {
                    Id = 1,
                    Name = "Tuscaloosa Community Center",
                    Address = "1000 5th Street, Tuscaloosa, AL 35401",
                    Latitude = 33.2098,
                    Longitude = -87.5692,
                    Type = "community_center",
                    ContactPerson = "Mary Williams",
                    PhoneNumber = "205-555-0201",
                    Hours = "Mon-Fri 8AM-6PM",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Location
                {
                    Id = 2,
                    Name = "Salvation Army Food Bank",
                    Address = "2000 10th Avenue, Tuscaloosa, AL 35401",
                    Latitude = 33.2015,
                    Longitude = -87.5623,
                    Type = "shelter",
                    ContactPerson = "Robert Brown",
                    PhoneNumber = "205-555-0202",
                    Hours = "Mon-Sat 9AM-5PM",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Location
                {
                    Id = 3,
                    Name = "University of Alabama Campus",
                    Address = "University Blvd, Tuscaloosa, AL 35401",
                    Latitude = 33.2098,
                    Longitude = -87.5692,
                    Type = "pickup_point",
                    ContactPerson = "Campus Services",
                    PhoneNumber = "205-555-0203",
                    Hours = "24/7",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<FoodDonation>().HasData(
                new FoodDonation
                {
                    Id = 1,
                    RestaurantId = 1,
                    FoodItem = "Fresh Bread",
                    Quantity = 20,
                    Weight = 15.5m,
                    ExpiryDate = new DateTime(2024, 1, 15),
                    Description = "Freshly baked bread from this morning",
                    Status = "Available",
                    PickupLocation = "Mario's Italian Bistro - 123 Main Street",
                    SpecialInstructions = "Please pick up from back entrance",
                    CreatedAt = new DateTime(2024, 1, 10, 8, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 10, 8, 0, 0, DateTimeKind.Utc)
                },
                new FoodDonation
                {
                    Id = 2,
                    RestaurantId = 2,
                    FoodItem = "Vegetable Soup",
                    Quantity = 10,
                    Weight = 25.0m,
                    ExpiryDate = new DateTime(2024, 1, 16),
                    Description = "Homemade vegetable soup, still warm",
                    Status = "Completed",
                    PickupLocation = "Campus Corner Cafe - 456 University Blvd",
                    DeliveryLocation = "Tuscaloosa Community Center",
                    PickupTime = new DateTime(2024, 1, 9, 14, 30, 0, DateTimeKind.Utc),
                    CompletionTime = new DateTime(2024, 1, 9, 15, 15, 0, DateTimeKind.Utc),
                    CreatedAt = new DateTime(2024, 1, 9, 12, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 9, 15, 15, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
