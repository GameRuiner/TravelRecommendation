namespace TravelRecommendation.Server
{
    public class MongoDBSettings
    {
        public required string ConnectionString { get; set; }
        public required string DatabaseName { get; set; }
        public required string HotelsCollection { get; set; }
    }
}
