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
        Task<Item> CreateItemAsync(string productId, Item item, LoginCredentials credentials);
        Task<IEnumerable<Item>> CreateManyItemsAsync(string productName, int itemQuantity, List<ItemAttribute> attributes, LoginCredentials credentials);
        Task<Product> CreateProductAsync(string name, string description, List<string> attributes, double price, LoginCredentials credentials);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName);
        Task<IEnumerable<Item>> GetByAttributeAsync(string productName, string type, string value);
        Task<Product> GetByNameAsync(string name);
        Task<IEnumerable<Item>> GetItemsAsync(string name);
        Task<Product> ModifyDescriptionAsync(string productName, string newDescription, LoginCredentials credentials);
        Task<Product> ModifyNameAsync(string oldName, string newName, LoginCredentials credentials);
        Task<Product> ModifyPriceAsync(string productName, double price, LoginCredentials credentials);
        Task<Item> PurchaseItem(Item item, LoginCredentials credentials);
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

        public async Task<Item> CreateItemAsync(string productId, Item item, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
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

        public async Task<IEnumerable<Item>> CreateManyItemsAsync(string productName, int itemQuantity, List<ItemAttribute> attributes, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
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

        public async Task<Product> CreateProductAsync(string name, string description, List<string> attributes, double price, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);

            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var product = new Product
                {
                    Name = name,
                    ProductDescription = description,
                    ProductId = Guid.NewGuid().ToString(),
                    Price = price,
                    AvailableAttributes = attributes
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

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string productName, string type, string value)
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

        public async Task<Product> ModifyDescriptionAsync(string productName, string newDescription, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var product = await productRepo.GetByNameAsync(productName);
                product.ProductDescription = newDescription;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Product> ModifyNameAsync(string oldName, string newName, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var product = await productRepo.GetByNameAsync(oldName);
                product.Name = newName;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Product> ModifyPriceAsync(string productName, double price, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var product = await productRepo.GetByNameAsync(productName);
                product.Price = price;
                await productRepo.UpdateAsync(product);
                return product;
            }
            return null;
        }

        public async Task<Item> PurchaseItem(Item item, LoginCredentials credentials)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            var loggedIn = await loginService.ValidateTokenAsync(credentials.Username, credentials.LoginToken);
            var hasPermission = await loginService.ValidatePermissionsAsync(account, PermissionType.User, credentials.UserToken);
            if (loggedIn && hasPermission)
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
    }
}
