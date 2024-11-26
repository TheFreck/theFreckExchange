using MongoDB.Bson;
using MongoDB.Driver.Linq;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static TheFreckExchange.Server.Services.ProductService;

namespace TheFreckExchange.Server.Services
{
    public interface IProductService
    {
        Task<Item> CreateItemAsync(string productId, Item item);
        Task<IEnumerable<Item>> CreateManyItemsAsync(string productName, int itemQuantity, List<ItemAttribute> attributes, LoginCredentials credentials);
        Task<Product> CreateProductAsync(string name, string description, List<string> attributes, double price, LoginCredentials credentials, List<IFormFile> images);
        IEnumerable<Product> GetAll();
        Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName);
        Task<IEnumerable<Item>> GetByAttributeAsync(string productName, string type, string value);
        Task<Product> GetByNameAsync(string name);
        Task<IEnumerable<Item>> GetItemsAsync(string name);
        Task<Product> ModifyDescriptionAsync(string productName, string newDescription, LoginCredentials credentials);
        Task<Product> ModifyNameAsync(string oldName, string newName, LoginCredentials credentials);
        Task<Product> ModifyPriceAsync(string productName, double price, LoginCredentials credentials);
        Task<List<Item>> PurchaseItem(ItemDTO item, int qty);
        Task<List<string>> GetAvailableAttributes(string productName);
        Task UpdateProductWithImageAsync(string productId, List<IFormFile> images);
        Task<Product> ModifyProductAsync(Product newProduct);
        IEnumerable<ImageFile> GetAllImages();
        Task UploadImagesAsync(List<IFormFile> images);
    }
    public class ProductService : IProductService
    {
        private readonly IProductRepo productRepo;
        private readonly IItemRepo itemRepo;
        private readonly IAccountRepo accountRepo;
        private readonly ILoginService loginService;
        private readonly IImageRepo imageRepo;
        public ProductService(IProductRepo productRepo, IItemRepo itemRepo, IAccountRepo accountRepo, ILoginService loginService, IImageRepo imageRepo)
        {
            this.productRepo = productRepo;
            this.itemRepo = itemRepo;
            this.accountRepo = accountRepo;
            this.loginService = loginService;
            this.imageRepo = imageRepo;
        }

        public async Task<Item> CreateItemAsync(string productId, Item item)
        {
            if (item.Credentials == null)
            {
                item.Name = "Missing or incorrect credentials";
                item.ProductDescription = "Missing or incorrect credentials";
                return item;
            }
            var account = await accountRepo.GetByUsernameAsync(item.Credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, item.Credentials.AdminToken))
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
            item.Name = "Missing or incorrect credentials";
            return item;
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
            return new List<Item>();
        }

        public async Task<Product> CreateProductAsync(string name, string description, List<string> attributes, double price, LoginCredentials credentials, List<IFormFile> images)
        {
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);

            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var count = 0;
                var product = new Product
                {
                    Name = name,
                    ProductDescription = description,
                    ProductId = Guid.NewGuid().ToString(),
                    Price = price,
                    AvailableAttributes = attributes,
                    ImageBytes = new List<byte[]>()
                };
                foreach (FormFile formFile in images)
                {
                    if (formFile.Length > 0)
                    {
                        using (var stream = new MemoryStream())
                        {
                            formFile.CopyTo(stream);
                            var fileBytes = stream.ToArray();

                            product.ImageBytes.Add(fileBytes);
                            //await productRepo.UpdateAsync(product);

                            //await imageRepo.UploadImageAsync(new ImageFile
                            //{
                            //    Image = fileBytes,
                            //    ImageId = Guid.NewGuid().ToString(),
                            //    Name = product.Name + count++
                            //});
                        }
                    }
                }

                await productRepo.CreateAsync(product);
                return product;
            }
            return new Product
            {
                Name = "Missing or incorrect credentials",
                Price = price,
                ProductDescription = "Missing or incorrect credentials",
                ProductId = Guid.Empty.ToString()
            };
        }

        public async Task UpdateProductWithImageAsync(string productId, List<IFormFile> images)
        {
            var product = await productRepo.GetByProductIdAsync(productId);
            long size = images.Sum(f => f.Length);
            var count = 0;
            foreach (FormFile formFile in images)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new MemoryStream())
                    {
                        formFile.CopyTo(stream);
                        var fileBytes = stream.ToArray();

                        product.ImageBytes.Add(fileBytes);
                        await productRepo.UpdateAsync(product);

                        await imageRepo.UploadImageAsync(new ImageFile
                        {
                            Image = fileBytes,
                            ImageId = Guid.NewGuid().ToString(),
                            Name = product.Name + count++
                        });
                    }
                }
            }
        }

        public IEnumerable<Product> GetAll()
        {
            var products = productRepo.GetAllProducts();
            if (products.ToList().Count > 0)
                return products;
            else return Enumerable.Empty<Product>();
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

        public async Task<List<string>> GetAvailableAttributes(string productName)
        {
            var product = await productRepo.GetByNameAsync(productName);
            return product.AvailableAttributes;
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
            if (items.Any())
                return items;
            else return Enumerable.Empty<Item>();
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
            return new Product
            {
                Name = "Missing or incorrect credentials",
                Price = 0,
                ProductDescription = "Missing or incorrect credentials",
                ProductId = Guid.Empty.ToString()
            };
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
            return new Product
            {
                Name = "Missing or incorrect credentials",
                Price = 0,
                ProductDescription = "Missing or incorrect credentials",
                ProductId = Guid.Empty.ToString()
            };
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
            return new Product
            {
                Name = "Missing or incorrect credentials",
                Price = price,
                ProductDescription = "Missing or incorrect credentials",
                ProductId = Guid.Empty.ToString()
            };
        }

        public async Task<List<Item>> PurchaseItem(ItemDTO item, int qty)
        {
            if (item.Credentials == null) return new List<Item>();
            var account = await accountRepo.GetByUsernameAsync(item.Credentials.Username);
            var loggedIn = await loginService.ValidateTokenAsync(item.Credentials.Username, item.Credentials.LoginToken);
            var hasPermission = await loginService.ValidatePermissionsAsync(account, PermissionType.User, item.Credentials.UserToken);
            if (loggedIn && hasPermission)
            {
                var product = await productRepo.GetByNameAsync(item.Name);
                var itemsReturned = (await itemRepo.GetByAttributesAsync(item.Name, item.Attributes)).ToList();

                if (itemsReturned.Count > qty)
                {
                    var purchased = new List<Item>();
                    for (var i = 0; i < qty; i++)
                    {
                        await itemRepo.DeleteItemAsync(itemsReturned[i]);
                        purchased.Add(itemsReturned[i]);
                    }
                    account.Balance += product.Price * qty;
                    accountRepo.Update(account);
                    return purchased;
                }
                else return new List<Item>();
            }
            else return new List<Item>();
        }

        public async Task<Product> ModifyProductAsync(Product newProduct)
        {
            var product = await productRepo.GetByNameAsync(newProduct.Name);
            product.Price = newProduct.Price;
            product.ProductDescription = newProduct.ProductDescription;
            product.AvailableAttributes = newProduct.AvailableAttributes;
            product.ImageBytes = newProduct.ImageBytes;
            await productRepo.UpdateAsync(product);
            return product;
        }

        public IEnumerable<ImageFile> GetAllImages()
        {
            return imageRepo.GetAll();
        }

        public async Task UploadImagesAsync(List<IFormFile> images)
        {
            long size = images.Sum(f => f.Length);
            foreach (FormFile formFile in images)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new MemoryStream())
                    {
                        formFile.CopyTo(stream);
                        var fileBytes = stream.ToArray();

                        await imageRepo.UploadImageAsync(new ImageFile
                        {
                            Image = fileBytes,
                            ImageId = Guid.NewGuid().ToString(),
                            Name = formFile.FileName
                        });
                    }
                }
            }
            return;
        }
    }
}
