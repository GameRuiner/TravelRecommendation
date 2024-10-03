using Microsoft.AspNetCore.Mvc;

namespace TravelRecommendation.Server.Controllers
{
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

        [HttpGet(Name = "GetRecommenedHotels")]
        public async Task<IActionResult> Get()
        {
            var hotels = await _hotelService.GetHotelsAsync(3);
            return Ok(hotels);
        }
    }
}
