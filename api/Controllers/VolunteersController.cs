using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.ComponentModel.DataAnnotations;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VolunteersController : ControllerBase
    {
        private readonly FoodWasteDbContext _context;

        public VolunteersController(FoodWasteDbContext context)
        {
            _context = context;
        }

        // GET: api/Volunteers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Volunteer>>> GetVolunteers()
        {
            return await _context.Volunteers
                .Include(v => v.User)
                .ToListAsync();
        }

        // GET: api/Volunteers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Volunteer>> GetVolunteer(int id)
        {
            var volunteer = await _context.Volunteers
                .Include(v => v.User)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (volunteer == null)
            {
                return NotFound();
            }

            return volunteer;
        }

        // POST: api/Volunteers
        [HttpPost]
        public async Task<ActionResult<Volunteer>> PostVolunteer(CreateVolunteerRegistrationDto createVolunteerDto)
        {
            // First, create the user account
            var user = new User
            {
                Username = createVolunteerDto.Username,
                Email = createVolunteerDto.Email,
                Password = createVolunteerDto.Password, // In production, hash this
                Role = "Volunteer",
                FirstName = createVolunteerDto.FirstName,
                LastName = createVolunteerDto.LastName,
                PhoneNumber = createVolunteerDto.PhoneNumber,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Then create the volunteer record
            var volunteer = new Volunteer
            {
                UserId = user.Id,
                Name = $"{user.FirstName} {user.LastName}",
                VehicleType = createVolunteerDto.VehicleType,
                LicensePlate = createVolunteerDto.LicensePlate,
                Availability = createVolunteerDto.Availability,
                IsAvailable = true,
                TotalPickups = 0,
                Rating = 0,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Volunteers.Add(volunteer);
            await _context.SaveChangesAsync();

            // Load the volunteer with user data for response
            var createdVolunteer = await _context.Volunteers
                .Include(v => v.User)
                .FirstOrDefaultAsync(v => v.Id == volunteer.Id);

            return CreatedAtAction("GetVolunteer", new { id = volunteer.Id }, createdVolunteer);
        }

        // PUT: api/Volunteers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVolunteer(int id, UpdateVolunteerDto updateVolunteerDto)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);

            if (volunteer == null)
            {
                return NotFound();
            }

            volunteer.VehicleType = updateVolunteerDto.VehicleType;
            volunteer.LicensePlate = updateVolunteerDto.LicensePlate;
            volunteer.Availability = updateVolunteerDto.Availability;
            volunteer.IsAvailable = updateVolunteerDto.IsAvailable;
            volunteer.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VolunteerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Volunteers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            _context.Volunteers.Remove(volunteer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VolunteerExists(int id)
        {
            return _context.Volunteers.Any(e => e.Id == id);
        }
    }

    // DTOs for volunteer registration
    public class CreateVolunteerRegistrationDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required]
        public string VehicleType { get; set; } = string.Empty;
        [Required]
        public string LicensePlate { get; set; } = string.Empty;
        [Required]
        public string Availability { get; set; } = string.Empty;
    }

    public class UpdateVolunteerDto
    {
        [Required]
        public string VehicleType { get; set; } = string.Empty;
        [Required]
        public string LicensePlate { get; set; } = string.Empty;
        [Required]
        public string Availability { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
    }
}
