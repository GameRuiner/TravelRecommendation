using Microsoft.AspNetCore.Mvc;

namespace TravelRecommendation.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HotelController : ControllerBase
    {
        private static readonly string[] Names = new[]
        {
            "Siesta Apart & Hotel", "Eden Roc Hotel", "Ohla Eixample"
        };
        private readonly ILogger<HotelController> _logger;

        public HotelController(ILogger<HotelController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetRecommenedHotels")]
        public IEnumerable<Hotel> Get()
        {
            return Enumerable.Range(0, 3).Select(index => new Hotel
            {
                Name = Names[index]
            })
            .ToArray();
        }
    }
}
