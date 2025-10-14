using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodDonationsController : ControllerBase
    {
        private readonly FoodWasteDbContext _context;

        public FoodDonationsController(FoodWasteDbContext context)
        {
            _context = context;
        }

        // GET: api/FoodDonations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodDonation>>> GetFoodDonations()
        {
            return await _context.FoodDonations
                .Include(f => f.Restaurant)
                .Include(f => f.Volunteer)
                .ToListAsync();
        }

        // GET: api/FoodDonations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FoodDonation>> GetFoodDonation(int id)
        {
            var foodDonation = await _context.FoodDonations
                .Include(f => f.Restaurant)
                .Include(f => f.Volunteer)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodDonation == null)
            {
                return NotFound();
            }

            return foodDonation;
        }

        // POST: api/FoodDonations
        [HttpPost]
        public async Task<ActionResult<FoodDonation>> PostFoodDonation(CreateFoodDonationDto createFoodDonationDto)
        {
            var foodDonation = new FoodDonation
            {
                RestaurantId = createFoodDonationDto.RestaurantId,
                FoodItem = createFoodDonationDto.FoodItem,
                Quantity = createFoodDonationDto.Quantity,
                Weight = createFoodDonationDto.Weight,
                ExpiryDate = createFoodDonationDto.ExpiryDate,
                Description = createFoodDonationDto.Description,
                PickupLocation = createFoodDonationDto.PickupLocation,
                SpecialInstructions = createFoodDonationDto.SpecialInstructions,
                Status = "Available",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.FoodDonations.Add(foodDonation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFoodDonation", new { id = foodDonation.Id }, foodDonation);
        }

        // PUT: api/FoodDonations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoodDonation(int id, UpdateFoodDonationDto updateFoodDonationDto)
        {
            var foodDonation = await _context.FoodDonations.FindAsync(id);
            if (foodDonation == null)
            {
                return NotFound();
            }

            foodDonation.FoodItem = updateFoodDonationDto.FoodItem;
            foodDonation.Quantity = updateFoodDonationDto.Quantity;
            foodDonation.Weight = updateFoodDonationDto.Weight;
            foodDonation.ExpiryDate = updateFoodDonationDto.ExpiryDate;
            foodDonation.Description = updateFoodDonationDto.Description;
            foodDonation.PickupLocation = updateFoodDonationDto.PickupLocation;
            foodDonation.SpecialInstructions = updateFoodDonationDto.SpecialInstructions;
            foodDonation.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodDonationExists(id))
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

        // DELETE: api/FoodDonations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodDonation(int id)
        {
            var foodDonation = await _context.FoodDonations.FindAsync(id);
            if (foodDonation == null)
            {
                return NotFound();
            }

            _context.FoodDonations.Remove(foodDonation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodDonationExists(int id)
        {
            return _context.FoodDonations.Any(e => e.Id == id);
        }
    }
}
