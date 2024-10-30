using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using System.Threading.Tasks;

namespace Payment_Processing.Server.Services
{
    public interface IProductService
    {
        Task<Product> CreateProductAsync(string name, string desccription, double price);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> GetByNameAsync(string name);
        Task<Product> ModifyDescriptionAsync(string name, string newDescription);
        Task<Product> ModifyNameAsync(string name, string product1NewName);
        Task<Product> ModifyPriceAsync(string name, double price);
        Task<IEnumerable<Item>> GetByAttributeAsync(string product1Id, AttributeType type, string value);
        Task<IEnumerable<Item>> GetItemsAsync(string name);
        Task<Item> PurchaseItem(string email, Item item);
    }
    public class ProductService : IProductService
    {
        private readonly IProductRepo productRepo;
        private readonly IItemRepo itemRepo;
        private readonly IAccountRepo accountRepo;
        public ProductService(IProductRepo productRepo, IItemRepo itemRepo, IAccountRepo accountRepo)
        {
            this.productRepo = productRepo;
            this.itemRepo = itemRepo;
            this.accountRepo = accountRepo;
        }

        public async Task<Item> CreateItemAsync(string product1Id, Item item)
        {
            var product = await productRepo.GetByProductIdAsync(product1Id);
            var newItem = new Item
            {
                Name = product.Name,
                Price = product.Price,
                ProductDescription = product.ProductDescription,
                ProductId = product.ProductId,
                SKU = Guid.NewGuid().ToString(),
                Attributes = item.Attributes,
            };
            var outcome = await itemRepo.CreateAsync(newItem);
            return outcome;
        }

        public async Task<Product> CreateProductAsync(string name, string desccription, double price)
        {
            var product = new Product
            {
                Name = name,
                ProductDescription = desccription,
                ProductId = Guid.NewGuid().ToString(),
                Price = price
            };

            await productRepo.CreateAsync(product);
            return product;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var products = await productRepo.GetAllProductsAsync();
            return products;
        }

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string product1Id, AttributeType type, string value)
        {
            var product = await productRepo.GetByProductIdAsync(product1Id);
            var items = await itemRepo.GetByAttributeAsync(product.Name, type, value);
            return items;
        }

        public async Task<Product> GetByNameAsync(string name)
        {
            var product = await productRepo.GetByNameAsync(name);
            return product;
        }

        public async Task<IEnumerable<Item>> GetItemsAsync(string name)
        {
            var items = await itemRepo.GetAllItemsAsync(name);
            return items;
        }

        public async Task<Product> ModifyDescriptionAsync(string name, string newDescription)
        {
            var product = await productRepo.GetByNameAsync(name);
            product.ProductDescription = newDescription;
            await productRepo.UpdateAsync(product);
            return product;
        }

        public async Task<Product> ModifyNameAsync(string name, string newName)
        {
            var product = await productRepo.GetByNameAsync(name);
            product.Name = newName;
            await productRepo.UpdateAsync(product);
            return product;
        }

        public async Task<Product> ModifyPriceAsync(string name, double price)
        {
            var product = await productRepo.GetByNameAsync(name);
            product.Price = price;
            await productRepo.UpdateAsync(product);
            return product;
        }

        public async Task<Item> PurchaseItem(string email, Item item)
        {
            var account = await accountRepo.GetByEmailAsync(email);
            var items = new List<Item>();
            for(var i=0; i<item.Attributes.Count; i++)
            {
                items.AddRange(await itemRepo.GetByAttributeAsync(item.Name, item.Attributes[i].Type, item.Attributes[i].Value));
            }
            var toBuy = new List<Item>();
            for(var i=0; i<item.Attributes.Count; i++)
            {
                toBuy.AddRange(items.Where(i => i.Attributes.ContainsAll(item.Attributes)));
            }
            account.Balance += items[0].Price;
            await accountRepo.UpdateAsync(account);
            await itemRepo.DeleteItemAsync(items[0]);
            return item;
        }
    }
}
