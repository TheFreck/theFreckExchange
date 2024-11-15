using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TheFreckExchange.Server.DTO;

namespace TheFreckExchange.Server.Repos
{
    public interface IItemRepo
    {
        Task<Item> CreateAsync(Item item);
        Task<DeleteResult> DeleteItemAsync(Item item);
        Task<IEnumerable<Item>> GetAllItemsAsync(string name);
        Task<IEnumerable<Item>> GetByAttributeAsync(string itemName, string attributeName, string attributeValue);
        Task<Item> GetBySKUAsync(string sku);
        Task<Item> UpdateAsync(Item item);
        Task<IEnumerable<Item>> GetByNameAsync(string name);
        Task<IEnumerable<Item>> GetByAttributesAsync(string itemName, List<ItemAttribute> attributes);
    }

    public class ItemRepo : IItemRepo
    {
        private readonly IMongoCollection<Item> itemsCollection;

        public ItemRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            itemsCollection = mongoDatabase.GetCollection<Item>(settings.Value.ItemCollectionName);
        }

        public async Task<Item> CreateAsync(Item item)
        {
            await itemsCollection.InsertOneAsync(item);
            return item;
        }

        public async Task<DeleteResult> DeleteItemAsync(Item item)
        {
            return await itemsCollection.DeleteOneAsync(i => i.SKU == item.SKU,CancellationToken.None);
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync(string name)
        {
            var items = await itemsCollection.FindAsync(i => i.Name == name);
            return items.ToEnumerable();
        }

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string itemName, string attributeName, string attributeValue)
        {
            var items = await itemsCollection.FindAsync(i => i.Name == itemName && i.Attributes.Select(a => a.Value).Contains(attributeValue));
            return items.ToEnumerable();
        }

        public async Task<IEnumerable<Item>> GetByNameAsync(string name)
        {
            var items = await itemsCollection.FindAsync(i => i.Name == name);
            return items.ToEnumerable();
        }

        public async Task<Item> GetBySKUAsync(string sku)
        {
            var item = await itemsCollection.FindAsync(i => i.SKU == sku);
            return item.FirstOrDefault();
        }

        public async Task<Item> UpdateAsync(Item item)
        {
            var gotten = await itemsCollection.FindAsync(i => i.SKU == item.SKU);
            var newItem = new Item
            {
                Name = item.Name,
                Attributes = item.Attributes,
                SKU = item.SKU,
                Price = item.Price,
                ProductDescription = item.ProductDescription,
                ProductId = item.ProductId,
            };
            return await itemsCollection.FindOneAndReplaceAsync(i => i.SKU==item.SKU,newItem);
        }

        public async Task<IEnumerable<Item>> GetByAttributesAsync(string itemName, List<ItemAttribute> attributes)
        {
            var items = (await itemsCollection.FindAsync(i => i.Name==itemName)).ToList();
            var matchingItems = new List<Item>();
            for(var i=0; i<attributes.Count; i++)
            {
                var att = attributes[i].Type;
                var val = attributes[i].Value;
                for(var j=0; j < items.Count; j++)
                {
                    if (items[j].Attributes.Where(a => a.Type == att).FirstOrDefault().Value != val)
                    {
                        items.Remove(items[j--]);
                    }
                }
            }
            return items;
        }
    }
}
