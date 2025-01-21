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
        private readonly ILogger<ProductRepo> logger;

        public ProductRepo(IOptions<MongoSettings> settings, ILogger<ProductRepo> logger)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            productsCollection = mongoDatabase.GetCollection<Product>(settings.Value.ProductCollectionName);
            this.logger = logger;
            logger.LogInformation("Constructed Product Repo");
        }
        public async Task CreateAsync(Product product)
        {
            logger.LogInformation($"Create product: {product.Name}");
            await productsCollection.InsertOneAsync(product);
        }

        public async Task UpdateAsync(Product product)
        {
            logger.LogInformation($"Update product: {product.Name}");
            await productsCollection.ReplaceOneAsync(a => a.ProductId == product.ProductId, product);
        }

        public async Task<Product> GetByProductIdAsync(string productId)
        {
            logger.LogInformation($"Get product by id: {productId}");
            return (await productsCollection.FindAsync(a => a.ProductId == productId)).FirstOrDefault();
        }

        public async Task<Product> GetByNameAsync(string name)
        {
            logger.LogInformation($"Get product by name: {name}");
            return (await productsCollection.FindAsync(a => a.Name == name)).FirstOrDefault();
        }

        public IEnumerable<Product> GetAllProducts()
        {
            logger.LogInformation("Get all products");
            var products = productsCollection.AsQueryable();
            return products;
        }
    }
}
