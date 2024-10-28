using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Payment_Processing.Server.DTO
{
    public class Account
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Name")]
        new required public string Name { get; set; }
        [BsonElement("AccountId")]
        new required public string AccountId { get; set; }
        public string Email { get; set; }
        public double Balance { get; set; }
        public DateTime DateOpened { get; set; }
    }
}