using Microsoft.AspNetCore.Mvc;

namespace TravelRecommendation.Server.Controllers
{
    public class RateHotelRequest
    {
        public required string HotelId { get; set; }
        public required string Prompt { get; set; }
        public required bool Rating { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class HotelController : ControllerBase
    {
        private readonly HotelService _hotelService;
        private readonly ILogger<HotelController> _logger;

        public HotelController(ILogger<HotelController> logger, HotelService hotelService)
        {
            _hotelService = hotelService;
            _logger = logger;
        }

        [HttpPost("get", Name = "GetRecommenedHotels")]
        public async Task<IActionResult> Get()
        {
            var hotels = await _hotelService.GetHotelsAsync(3);
            return Ok(hotels);
        }

        [HttpPost("rate", Name = "RateRecommenedHotel")]
        public async Task<IActionResult> Rate([FromBody] RateHotelRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data");
            }
            await _hotelService.RateHotelAsync(request.HotelId, request.Rating, request.Prompt);
            return Ok("Rating submitted successfully");
        }
    }
}
