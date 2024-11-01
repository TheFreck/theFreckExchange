using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Payment_Processing.Server.Services.ProductService;

namespace Payment_Processing.Server.Services
{
    public interface IProductService
    {
        Task<Product> CreateProductAsync(string username, string name, string desccription, double price);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> GetByNameAsync(string name);
        Task<Product> ModifyDescriptionAsync(string name, string newDescription, string product1NewDesc);
        Task<Product> ModifyNameAsync(string username, string oldName, string newName);
        Task<Product> ModifyPriceAsync(string username, string name, double price);
        Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string product1Name);
        Task<IEnumerable<Item>> GetByAttributeAsync(string productId, AttributeType type, string value);
        Task<IEnumerable<Item>> GetItemsAsync(string name);
        Task<Item> CreateItemAsync(string username, string productId, Item item);
        Task<IEnumerable<Item>> CreateManyItemsAsync(string username, string productName, int itemQuantity, List<ItemAttribute> attributes);
        Task<Item> PurchaseItem(string username, string token, Item item);
    }
    public class ProductService : IProductService
    {
        private readonly IProductRepo productRepo;
        private readonly IItemRepo itemRepo;
        private readonly IAccountRepo accountRepo;
        private readonly ILoginService loginService;
        public ProductService(IProductRepo productRepo, IItemRepo itemRepo, IAccountRepo accountRepo, ILoginService loginService)
        {
            this.productRepo = productRepo;
            this.itemRepo = itemRepo;
            this.accountRepo = accountRepo;
            this.loginService = loginService;
        }

        public async Task<Item> CreateItemAsync(string username, string productId, Item item)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
            {
                var product = await productRepo.GetByProductIdAsync(productId);
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
            return null;
        }

        public async Task<IEnumerable<Item>> CreateManyItemsAsync(string username, string productName, int itemQuantity, List<ItemAttribute> attributes)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
            {
                var product = await productRepo.GetByNameAsync(productName);
                var items = new List<Item>();
                for (var i = 0; i < itemQuantity; i++)
                {
                    var item = new Item
                    {
                        Name = product.Name,
                        Price = product.Price,
                        ProductDescription = product.ProductDescription,
                        ProductId = product.ProductId,
                        SKU = Guid.NewGuid().ToString(),
                        Attributes = attributes
                    };
                    await itemRepo.CreateAsync(item);
                    items.Add(item);
                }
                return items;
            }
            return null;
        }

        public async Task<Product> CreateProductAsync(string username, string name, string desccription, double price)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
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
            return null;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var products = await productRepo.GetAllProductsAsync();
            return products;
        }

        public async Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName)
        {
            var items = await itemRepo.GetAllItemsAsync(productName);
            var selected = items.SelectMany(i => i.Attributes).ToHashSet();
            var groups = selected.GroupBy(attribute => attribute.Type, attribute => attribute.Value, (type, value) =>
            new GroupedAttributes
            {
                Type = type.ToString(),
                Value = value.ToHashSet(),
            });
            return groups;
        }

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string productName, AttributeType type, string value)
        {
            var items = await itemRepo.GetByAttributeAsync(productName, type, value);
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

        public async Task<Product> ModifyDescriptionAsync(string username, string productName, string newDescription)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
            {
                var product = await productRepo.GetByNameAsync(productName);
                product.ProductDescription = newDescription;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Product> ModifyNameAsync(string username, string oldName, string newName)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
            {
                var product = await productRepo.GetByNameAsync(oldName);
                product.Name = newName;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Product> ModifyPriceAsync(string username, string productName, double price)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin))
            {
                var product = await productRepo.GetByNameAsync(productName);
                product.Price = price;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Item> PurchaseItem(string username, string token, Item item)
        {
            var account = await accountRepo.GetByUsernameAsync(username);

            if (await loginService.ValidateTokenAsync(username, token))
            {
                if (await loginService.ValidatePermissionsAsync(account, PermissionType.User))
                {
                    var items = new List<Item>();
                    for (var i = 0; i < item.Attributes.Count; i++)
                    {
                        items.AddRange(await itemRepo.GetByAttributeAsync(item.Name, item.Attributes[i].Type, item.Attributes[i].Value));
                    }
                    var toBuy = new List<Item>();
                    for (var i = 0; i < item.Attributes.Count; i++)
                    {
                        toBuy.AddRange(items.Where(i => i.Attributes.ContainsAll(item.Attributes)));
                    }
                    account.Balance += items[0].Price;
                    await accountRepo.UpdateAsync(account);
                    await itemRepo.DeleteItemAsync(items[0]);
                    return item;
                }
                else return null;
            }
            else
            {
                return null;
            }
        }
    }
}
