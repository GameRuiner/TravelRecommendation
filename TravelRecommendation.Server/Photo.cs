using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TravelRecommendation.Server
{
    [BsonIgnoreExtraElements]
    public class Photo
    {
        [BsonElement("id")]
        public long PhotoId { get; set; }
        [BsonElement("album")]
        public required string Album { get; set; }
        [BsonElement("images")]
        public required Images Images { get; set; }

    }

    public class Image
    {
        [BsonElement("height")]
        public required int Height { get; set; }
        [BsonElement("width")]
        public required int Width { get; set; }
        [BsonElement("url")]
        public required string URL { get; set; }
    }

    public class Images
    {
        [BsonElement("thumbnail")]
        public required Image Thumbnail { get; set; }

        [BsonElement("small")]
        public required Image Small { get; set; }

        [BsonElement("medium")]
        public required Image Medium { get; set; }

        [BsonElement("large")]
        public required Image Large { get; set; }

        [BsonElement("original")]
        public required Image Original { get; set; }
    }
}