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

        public string ConfigId {  get; set; } = Guid.Empty.ToString();

        public HashSet<string> AdminAccountIds {get;set; } = new HashSet<string>();

        public string SiteTitle { get; set; } = String.Empty;
        
        public string CategoryTitle {  get; set; } = String.Empty;
        public List<Categories> Categories { get; set; } = new List<Categories>();
        public List<string> Images { get; set; } = new List<string>();
        public string Background { get; set; } = String.Empty;
    }
}
