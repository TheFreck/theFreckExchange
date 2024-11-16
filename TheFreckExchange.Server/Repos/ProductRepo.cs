using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TheFreckExchange.Server.DTO;

namespace TheFreckExchange.Server.Repos
{
    public interface IProductRepo
    {
        Task CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task<Product> GetByProductIdAsync(string productId);
        Task<Product> GetByNameAsync(string name);
        IEnumerable<Product> GetAllProducts();
    }
    public class ProductRepo : IProductRepo
    {
        private readonly IMongoCollection<Product> productsCollection;

        public ProductRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            productsCollection = mongoDatabase.GetCollection<Product>(settings.Value.ProductCollectionName);
        }
        public async Task CreateAsync(Product product)
        {
            await productsCollection.InsertOneAsync(product);
        }

        public async Task UpdateAsync(Product product)
        {
            await productsCollection.ReplaceOneAsync(a => a.ProductId == product.ProductId, product);
        }

        public async Task<Product> GetByProductIdAsync(string productId)
        {
            return (await productsCollection.FindAsync(a => a.ProductId == productId)).FirstOrDefault();
        }

        public async Task<Product> GetByNameAsync(string name)
        {
            return (await productsCollection.FindAsync(a => a.Name == name)).FirstOrDefault();
        }

        public IEnumerable<Product> GetAllProducts()
        {
            var products = productsCollection.AsQueryable();
            return products;
        }
    }
}
