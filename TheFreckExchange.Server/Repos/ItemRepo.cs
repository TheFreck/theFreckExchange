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
        Task<Item> GetByNameAsync(string name);
        Task<Item> GetByAttributesAsync(string itemName, IEnumerable<ItemAttribute> attributes);
    }

    public class ItemRepo : IItemRepo
    {
        private readonly IMongoCollection<Item> itemsCollection;
        private readonly ILogger<ItemRepo> logger;

        public ItemRepo(IOptions<MongoSettings> settings, ILogger<ItemRepo> logger)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            itemsCollection = mongoDatabase.GetCollection<Item>(settings.Value.ItemCollectionName);
            this.logger = logger;
            logger.LogInformation("Constructed Item Repo");
        }

        public async Task<Item> CreateAsync(Item item)
        {
            logger.LogInformation($"Create item: {item.Name}");
            await itemsCollection.InsertOneAsync(item);
            return item;
        }

        public async Task<DeleteResult> DeleteItemAsync(Item item)
        {
            logger.LogInformation($"Delete item: {item.Name}");
            return await itemsCollection.DeleteOneAsync(i => i.SKU == item.SKU, CancellationToken.None);
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync(string name)
        {
            logger.LogInformation($"Get all items: {name}");
            var items = await itemsCollection.FindAsync(i => i.Name == name);
            return items.ToEnumerable();
        }

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string itemName, string attributeName, string attributeValue)
        {
            logger.LogInformation($"Get {itemName} items by attribute: {attributeName} - {attributeValue}");
            var items = await itemsCollection.FindAsync(i => i.Name == itemName && i.Attributes.Select(a => a.Value).Contains(attributeValue));
            return items.ToEnumerable();
        }

        public async Task<Item> GetByNameAsync(string name)
        {
            logger.LogInformation($"Get item by name: {name}");
            var items = await itemsCollection.FindAsync(i => i.Name == name);
            return items.FirstOrDefault();
        }

        public async Task<Item> GetBySKUAsync(string sku)
        {
            logger.LogInformation($"Get item by SKU: {sku}");
            var item = await itemsCollection.FindAsync(i => i.SKU == sku);
            logger.LogInformation($"Got item by SKU: {item.FirstOrDefault().Name}");
            return item.FirstOrDefault();
        }

        public async Task<Item> UpdateAsync(Item item)
        {
            logger.LogInformation($"Updating item: {item.Name}");
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
            return await itemsCollection.FindOneAndReplaceAsync(i => i.SKU == item.SKU, newItem);
        }

        public async Task<Item> GetByAttributesAsync(string itemName, IEnumerable<ItemAttribute> attributes)
        {
            logger.LogInformation($"Get {itemName} by attributes");
            var items = (await itemsCollection.FindAsync(i => i.Name == itemName)).ToList();
            for (var i = 0; i < attributes.Count(); i++)
            {
                var att = attributes.ToList()[i].Type;
                var val = attributes.ToList()[i].Value;
                for (var j = 0; j < items.Count; j++)
                {
                    if (items[j].Attributes?.Where(a => a.Type == att)?.FirstOrDefault()?.Value != val)
                    {
                        items.Remove(items[j--]);
                    }
                }
            }
            if (items.Any()) return items.FirstOrDefault();
            else throw new Exception("no items match those attributes");
        }
    }
}
