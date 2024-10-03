using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TravelRecommendation.Server
{
    [BsonIgnoreExtraElements]
    public class Hotel
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("location_id")]
        public required string LocationId { get; set; }
        [BsonElement("name")]
        public required string Name { get; set; }
        [BsonElement("brand")]
        public string? Brand { get; set; }
        [BsonElement("description")]
        public required string Description { get; set; }

    }
}
