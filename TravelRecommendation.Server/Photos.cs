using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TravelRecommendation.Server
{
    public class Photos
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("location_id")]
        public required string LocationId { get; set; }
        [BsonElement("photos")]
        public required Photo[] Data { get; set; }

    }
}
