using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TravelRecommendation.Server
{
    public class HotelService
    {
        private readonly IMongoCollection<Hotel> _hotelsCollection;

        public HotelService(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _hotelsCollection = database.GetCollection<Hotel>(mongoDBSettings.Value.HotelsCollection);
        }

        public async Task<List<Hotel>> GetHotelsAsync(int limit)
        {
            return await _hotelsCollection.Find(hotel => true).Limit(limit).ToListAsync();
        }

        public async Task<Hotel> GetHotelAsync(string id)
        {
            return await _hotelsCollection.Find(hotel => hotel.LocationId == id).FirstOrDefaultAsync();
        }

    }
}
