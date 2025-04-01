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
        [BsonElement("amenities")]
        public required List<string> Amenities { get; set; }
        [BsonElement("name")]
        public required string Name { get; set; }
        [BsonElement("ancestors")]
        public required Ancestor[] Ancestors { get; set; }
        [BsonElement("brand")]
        public string? Brand { get; set; }
        [BsonElement("description")]
        public required string Description { get; set; }
        [BsonElement("Photos")]
        public List<Photos>? Photos { get; set; }
        [BsonElement("hotel_class")]
        public float? HotelClass { get; set; }
        [BsonElement("price_level")]
        public string PriceLevel { get; set; }
        [BsonElement("rating")]
        public string Rating { get; set; }

        public string GetHotelLocation()
        {
            var ancestors = Ancestors;
            string country = string.Empty;
            string region = string.Empty;
            string city = string.Empty;
            foreach (var ancestor in ancestors)
            {
                switch (ancestor.Level)
                {
                    case "City":
                    case "Municipality":
                    case "Island":
                        city = ancestor.Name;
                        break;
                    case "Region":
                        region = ancestor.Name;
                        break;
                    case "Country":
                        country = ancestor.Name;
                        break;
                }
            }
            var ancestorsArray = new List<string> { country, region, city }
                                    .Where(ancestor => !string.IsNullOrEmpty(ancestor));
            return string.Join(" / ", ancestorsArray);
        }

        public Image? GetHotelImage()
        {
            var albumPriority = new[]
            {
                "Hotel & Grounds",
                "Pool/Beach Area",
                "Room/Suite",
                "Other"
            };
            var photosData = Photos?.FirstOrDefault()?.Data;
            var imageObj = albumPriority
                .Select(album => photosData?.FirstOrDefault(image => image.Album == album))
                .FirstOrDefault(image => image != null);
            return imageObj?.Images?.Large;
        }
    }

    public class Ancestor
    {
        [BsonElement("abbrv")]
        public string? Abbreviation { get; set; }
        [BsonElement("level")]
        public required string Level { get; set; }
        [BsonElement("name")]
        public required string Name { get; set; }
        [BsonElement("location_id")]
        public required string LocationId { get; set; }
    }
}
