using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;


namespace TravelRecommendation.Server
{
    public class HotelService
    {
        private readonly IMongoCollection<Hotel> _hotelsCollection;
        private readonly IMongoCollection<Hotel> _photosCollection;

        public HotelService(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _hotelsCollection = database.GetCollection<Hotel>(mongoDBSettings.Value.HotelsCollection);
            _photosCollection = database.GetCollection<Hotel>(mongoDBSettings.Value.PhotosCollection);
        }

        public async Task<List<Hotel>> GetHotelsAsync(int limit)
        {
            var pipeline = new[]
            {
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

            return await _hotelsCollection.Aggregate<Hotel>(pipeline).ToListAsync();
        }

        public async Task<Hotel> GetHotelAsync(string id)
        {
            return await _hotelsCollection.Find(hotel => hotel.LocationId == id).FirstOrDefaultAsync();
        }
    }


}
