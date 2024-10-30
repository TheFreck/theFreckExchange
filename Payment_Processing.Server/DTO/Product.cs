using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Payment_Processing.Server.DTO
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string? Id { get; set; }

        [BsonElement("Name")]
        public required string Name { get; set; }

        [BsonElement("ProductId")]
        public required string ProductId { get; init; }

        public required string ProductDescription { get; set; }

        public required double Price { get; set; }

        public Product()
        {
            ProductId = Guid.NewGuid().ToString();
        }
    }

    public class ProductDTO
    {
        public required string Name { get; set; }
        public required double Price { get; set; }
        public required string Description { get; set; }
    }

    public class Item : Product
    {
        //[BsonId]
        //[BsonRepresentation(BsonType.ObjectId)]
        //public string? Id { get; set; }

        [BsonElement("SKU")]
        public required string SKU { get; init; } = Guid.NewGuid().ToString();
        public List<ItemAttribute>? Attributes { get; set; }
    }

    public class ItemAttribute
    {
        public required AttributeType Type { get; set; }
        public required string Value { get; set; }
    }

    public enum AttributeType
    {
        Color,Size,Style
    }
}
