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

        public string AdminAccountId {get;set;}

        public string SiteTitle { get; set; }
        
        public string CategoryTitle {  get; set; }
        public List<Categories> Categories { get; set; }
        public List<ImageFile> ImageFiles { get; set; }
        public ImageFile Background {  get; set; }
    }
}
