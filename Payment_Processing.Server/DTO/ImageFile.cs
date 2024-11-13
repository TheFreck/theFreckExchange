using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Payment_Processing.Server.DTO
{
    public class ImageFile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string? Id { get; set; }
        public byte[] Image { get; set; }
        public string Name { get; set; }
        public string ImageId { get; set; }
    }
}
