using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;


namespace TravelRecommendation.Server
{
    public class Prompt
    {
        public ObjectId Id { get; set; }
        public required string Text { get; set; }

    }
    public class HotelRating
    {
        public ObjectId Id { get; set; }
        public required string HotelId { get; set; }
        public ObjectId PromptId { get; set; }
        public bool Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class RecommendationRequest
    {
        [JsonPropertyName("prompt")]
        public required string Prompt { get; set; }
    }
    public class HotelRecommendation
    {
        [JsonPropertyName("locationId")]
        public required string LocationId { get; set; }
    }
    public class HotelService
    {
        private readonly IMongoCollection<Hotel> _hotelsCollection;
        private readonly IMongoCollection<Photos> _photosCollection;
        private readonly IMongoCollection<HotelRating> _ratingsCollection;
        private readonly IMongoCollection<Prompt> _promptsCollection;

        public HotelService(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _hotelsCollection = database.GetCollection<Hotel>(mongoDBSettings.Value.HotelsCollection);
            _photosCollection = database.GetCollection<Photos>(mongoDBSettings.Value.PhotosCollection);
            _ratingsCollection = database.GetCollection<HotelRating>(mongoDBSettings.Value.RatingsCollection);
            _promptsCollection = database.GetCollection<Prompt>(mongoDBSettings.Value.PromptsCollection);
        }

        public async Task<List<HotelDto>> FetchRecommendedHotelsWithPhotos(string prompt, int limit)
        {
            var recommendedHotels = await GetRecommendedHotels(prompt);
            var hotels = await GetHotelDetailsWithPhotos(recommendedHotels, limit);
            return hotels;
        }

        public async Task<List<HotelRecommendation>> GetRecommendedHotels(string prompt)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://127.0.0.1:8000");
                var request = new RecommendationRequest { Prompt = prompt };
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/recommendations", content);
                response.EnsureSuccessStatusCode();
                var responseBody = await response.Content.ReadAsStringAsync();
                var recommendations = JsonSerializer.Deserialize<Dictionary<string, List<HotelRecommendation>>>(responseBody);
                if (recommendations == null) return [];
                return recommendations["recommendations"];
            }
        }


        public async Task<List<HotelDto>> GetHotelDetailsWithPhotos(List<HotelRecommendation> hotels, int limit)
        {
            List<string> hotelIds = new List<string>();
            foreach (var hotel in hotels)
            {
                hotelIds.Add(hotel.LocationId);
            }
            var filter = new BsonDocument
            {
                {"$match", new BsonDocument { { "location_id", new BsonDocument { { "$in", new BsonArray(hotelIds) } } } } }
            };
            var pipeline = new[]
            {
                    filter,
                    new BsonDocument
                    {
                        { "$lookup", new BsonDocument
                            {
                                { "from", "photos" },
                                { "localField", "location_id" },
                                { "foreignField", "location_id" },
                                { "as", "Photos" }
                            }
                        }
                    },
                    new BsonDocument
                    {
                        { "$limit", limit }
                    }
                };

            var hotelsList = await _hotelsCollection.Aggregate<Hotel>(pipeline).ToListAsync();
            var projectedHotelsList = hotelsList.Select(hotel => new HotelDto
            {
                Id = hotel.LocationId,
                Name = hotel.Name,
                Location = hotel.GetHotelLocation(),
                Image = hotel.GetHotelImage(),
                HotelClass = hotel.HotelClass
            }).ToList();
            return projectedHotelsList;
        }


        public async Task RateHotelAsync(string hotelId, bool rating, string prompt)
        {
            var existingPrompt = await _promptsCollection
                .Find(p => p.Text == prompt)
                .FirstOrDefaultAsync();
            ObjectId promptId;
            if (existingPrompt == null)
            {
                var newPrompt = new Prompt
                {
                    Text = prompt,
                };
                await _promptsCollection.InsertOneAsync(newPrompt);
                promptId = newPrompt.Id;
            }
            else
            {
                promptId = existingPrompt.Id;
            }
            var hotelRating = new HotelRating
            {
                HotelId = hotelId,
                PromptId = promptId,
                Rating = rating,
                CreatedAt = DateTime.UtcNow,
            };
            await _ratingsCollection.InsertOneAsync(hotelRating);
        }
    }

    public class HotelDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Location { get; set; }
        public Image? Image { get; set; }
        public float? HotelClass { get; set; }
    }


}
