using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TheFreckExchange.Server.DTO
{
    public class ImageFile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string? Id { get; set; }
        public required byte[] Image { get; set; }
        public required string Name { get; set; }
        public string ImageId { get; set; } = string.Empty;
    }
}
