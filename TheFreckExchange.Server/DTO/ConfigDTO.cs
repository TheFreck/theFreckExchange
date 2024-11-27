using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace TheFreckExchange.Server.DTO
{
    public class ConfigDTO
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string ConfigId {  get; set; } = Guid.NewGuid().ToString();

        public string AdminAccountId {get;set; } = Guid.NewGuid().ToString();

        public string SiteTitle { get; set; } = String.Empty;
        
        public string CategoryTitle {  get; set; } = String.Empty;
        public List<Categories> Categories { get; set; } = new List<Categories>();
        public List<ImageFile> ImageFiles { get; set; } = new List<ImageFile>();
        public ImageFile? Background {  get; set; }
    }
}
