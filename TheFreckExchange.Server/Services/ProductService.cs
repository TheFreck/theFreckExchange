using MongoDB.Driver.Linq;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;

namespace TheFreckExchange.Server.Services
{
    public interface IProductService
    {
        Task<Item> CreateItemAsync(string productId, Item item);
        Task<Item> CreateItemsAsync(string productId, int itemQuantity, IEnumerable<ItemAttribute> attributes, LoginCredentials credentials);
        Task<Product> CreateProductAsync(string name, string description, IEnumerable<string> attributes, double price, LoginCredentials credentials, IEnumerable<string> images, string primaryImageReference);
        IEnumerable<Product> GetAll();
        Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName);
        Task<IEnumerable<Item>> GetByAttributeAsync(string productName, string type, string value);
        Task<Product> GetByNameAsync(string name);
        Task<List<Item>> GetItemsAsync(string name);
        Task<Product> ModifyDescriptionAsync(string productName, string newDescription, LoginCredentials credentials);
        Task<Product> ModifyNameAsync(string oldName, string newName, LoginCredentials credentials);
        Task<Product> ModifyPriceAsync(string productName, double price, LoginCredentials credentials);
        Task<Item> PurchaseItem(ItemDTO item, int qty);
        Task<IEnumerable<string>> GetAvailableAttributes(string productName);
        Task UpdateProductWithImageAsync(string productId, IEnumerable<IFormFile> images);
        Task<Product> ModifyProductAsync(ProductDTO newProduct);
        IEnumerable<ImageFile> GetAllImages();
        Task<IEnumerable<ImageFile>> UploadImagesAsync(IEnumerable<IFormFile> images);
        Task<IEnumerable<ImageFile>> GetAllSiteImagesAsync();
        Task<ImageFile> GetBackgroundImageAsync();
        Task<IEnumerable<ImageFile>> GetImagesAsync(IEnumerable<string> imageIds);
        Task<IEnumerable<ImageFile>> GetImagesAsync(string productId);
    }
    public class ProductService : IProductService
    {
        private readonly IProductRepo productRepo;
        private readonly IItemRepo itemRepo;
        private readonly IAccountRepo accountRepo;
        private readonly ILoginService loginService;
        private readonly IImageRepo imageRepo;
        private readonly IConfigRepo configRepo;
        private readonly ILogger<ProductService> logger;
        public ProductService(IProductRepo productRepo, IItemRepo itemRepo, IAccountRepo accountRepo, ILoginService loginService, IImageRepo imageRepo, IConfigRepo configRepo, ILogger<ProductService> logger)
        {
            this.productRepo = productRepo;
            this.itemRepo = itemRepo;
            this.accountRepo = accountRepo;
            this.loginService = loginService;
            this.imageRepo = imageRepo;
            this.configRepo = configRepo;
            this.logger = logger;
        }

        public async Task<Item> CreateItemAsync(string productId, Item item)
        {
            logger.LogInformation($"Create item {item.Name}, Service");
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

        public async Task<Item> CreateItemsAsync(string productId, int itemQuantity, IEnumerable<ItemAttribute> attributes, LoginCredentials credentials)
        {
            logger.LogInformation($"Create Items: {productId}, Service");
            var account = await accountRepo.GetByUsernameAsync(credentials.Username);
            if (await loginService.ValidatePermissionsAsync(account, PermissionType.Admin, credentials.AdminToken))
            {
                var product = await productRepo.GetByProductIdAsync(productId);
                var item = new Item
                {
                    Name = product.Name,
                    Quantity = itemQuantity,
                    Price = product.Price,
                    ProductDescription = product.ProductDescription,
                    ProductId = product.ProductId,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = attributes
                };
                return await itemRepo.CreateAsync(item);
            }
            return new Item
            {
                Name = "Not Authorized to Create Items",
                Quantity = 0,
                Price = 0,
                ProductDescription = "Not Authorized to Create Items",
                ProductId = Guid.Empty.ToString(),
                SKU = Guid.Empty.ToString(),
            };
        }

        public async Task<Product> CreateProductAsync(string name, string description, IEnumerable<string> attributes, double price, LoginCredentials credentials, IEnumerable<string> images, string primaryImageReference)
        {
            logger.LogInformation($"Create Product {name}, Service");
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
                    ImageReferences = images,
                    PrimaryImageReference = primaryImageReference
                };

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

        public async Task UpdateProductWithImageAsync(string productId, IEnumerable<IFormFile> images)
        {
            logger.LogInformation($"Update product {productId} with image");
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
                        var imageId = Guid.NewGuid().ToString();
                        product.ImageReferences.ToList().Add(imageId);
                        await productRepo.UpdateAsync(product);

                        await imageRepo.UploadImageAsync(new ImageFile
                        {
                            Image = fileBytes,
                            ImageId = imageId,
                            Name = formFile.FileName
                        });
                    }
                }
            }
        }

        public IEnumerable<Product> GetAll()
        {
            logger.LogInformation("Get all products, Service");
            var products = productRepo.GetAllProducts();
            if (products.ToList().Count > 0)
                return products;
            else return Enumerable.Empty<Product>();
        }

        public async Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName)
        {
            logger.LogInformation($"Get attributes of {productName} product, Service");
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

        public async Task<IEnumerable<string>> GetAvailableAttributes(string productName)
        {
            logger.LogInformation($"Get available attributes for {productName}, Service");
            var product = await productRepo.GetByNameAsync(productName);
            return product.AvailableAttributes;
        }

        public async Task<IEnumerable<Item>> GetByAttributeAsync(string productName, string type, string value)
        {
            logger.LogInformation($"Get {productName} items by attribute: {type} - {value}, Service");
            var items = await itemRepo.GetByAttributeAsync(productName, type, value);
            return items;
        }

        public async Task<Product> GetByNameAsync(string name)
        {
            logger.LogInformation($"Get product by name: {name}, Service");
            var product = await productRepo.GetByNameAsync(name);
            return product;
        }

        public async Task<List<Item>> GetItemsAsync(string name)
        {
            logger.LogInformation($"Get {name} items, Servicec");
            var items = (await itemRepo.GetAllItemsAsync(name)).ToList();
            if (items.Any())
                return items;
            else return new List<Item>();
        }

        public async Task<Product> ModifyDescriptionAsync(string productName, string newDescription, LoginCredentials credentials)
        {
            logger.LogInformation($"Modify {productName} description, Service");
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
            logger.LogInformation($"Modify product name from {oldName} to {newName}, Service");
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
            logger.LogInformation($"Modify {productName} price to: {price}, Service");
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

        public async Task<Item> PurchaseItem(ItemDTO item, int qty)
        {
            logger.LogInformation($"Purchase {qty} of {item.Name}, Service");
            if (item.Credentials == null) throw new Exception("invalid credentials");
            var account = await accountRepo.GetByUsernameAsync(item.Credentials.Username);
            var loggedIn = await loginService.ValidateTokenAsync(item.Credentials.Username, item.Credentials.LoginToken);
            var hasPermission = await loginService.ValidatePermissionsAsync(account, PermissionType.User, item.Credentials.UserToken);
            if (loggedIn && hasPermission)
            {
                var product = await productRepo.GetByNameAsync(item.Name);
                var itemReturned = await itemRepo.GetByAttributesAsync(item.Name, item.Attributes);

                if (itemReturned.Quantity >= qty)
                {
                    await itemRepo.DeleteItemAsync(itemReturned);
                    account.Balance -= product.Price * qty;
                    account.History.Add(new PurchaseOrder
                    {
                        Item = itemReturned,
                        TotalPrice = product.Price * qty,
                        TransactionDate = DateTime.Now
                    });
                    accountRepo.Update(account);
                    return itemReturned;
                }
                else throw new Exception("Out of Stock");
            }
            else throw new Exception("invalid credentials");
        }

        public async Task<Product> ModifyProductAsync(ProductDTO newProduct)
        {
            logger.LogInformation($"Modify product - {newProduct.Name}, Service");
            var product = await productRepo.GetByNameAsync(newProduct.Name);
            product.Price = newProduct.Price > 0 ? newProduct.Price : product.Price;
            product.ProductDescription = newProduct.Description != String.Empty ? newProduct.Description : product.ProductDescription;
            product.AvailableAttributes = newProduct.Attributes.Count() > 0 ? product.AvailableAttributes.Where(a => a != "").Concat(newProduct.Attributes.Where(a => a != "")).ToHashSet().ToList() : product.AvailableAttributes;
            product.ImageReferences = newProduct.ImageReferences.Count() > 0 ? product.ImageReferences.Concat(newProduct.ImageReferences).ToHashSet().ToList() : product.ImageReferences;
            await productRepo.UpdateAsync(product);
            return product;
        }

        public IEnumerable<ImageFile> GetAllImages()
        {
            logger.LogInformation("Get all images, Service");
            return imageRepo.GetAll();
        }

        public async Task<IEnumerable<ImageFile>> UploadImagesAsync(IEnumerable<IFormFile> images)
        {
            logger.LogInformation("Upload images, Service");
            long size = images.Sum(f => f.Length);
            var imageList = new List<ImageFile>();
            foreach (FormFile formFile in images)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new MemoryStream())
                    {
                        formFile.CopyTo(stream);
                        var fileBytes = stream.ToArray();

                        var newImageFile = new ImageFile
                        {
                            Image = fileBytes,
                            ImageId = Guid.NewGuid().ToString(),
                            Name = formFile.FileName
                        };
                        await imageRepo.UploadImageAsync(newImageFile);
                        imageList.Add(newImageFile);
                    }
                }
            }
            return imageList;
        }

        public async Task<IEnumerable<ImageFile>> GetAllSiteImagesAsync()
        {
            logger.LogInformation("Get all site images, Service");
            var config = await configRepo.GetConfigAsync();
            if (config == null) return new List<ImageFile>();
            var images = imageRepo.GetAll();
            var siteImages = images.Where(i => config.Images.Contains(i.ImageId));
            return siteImages;
        }

        public async Task<ImageFile> GetBackgroundImageAsync()
        {
            logger.LogInformation("Get background images, Service");
            var config = await configRepo.GetConfigAsync();
            if (config == null || config.Background == null) return new ImageFile { Image = new byte[64], Name = "no background found" };
            return await imageRepo.GetBackgroundImageAsync(config.Background);
        }

        public async Task<IEnumerable<ImageFile>> GetImagesAsync(IEnumerable<string> imageIds)
        {
            logger.LogInformation("Get images from imageIds, Service");
            return await imageRepo.GetImageFilesAsync(imageIds);
        }

        public async Task<IEnumerable<ImageFile>> GetImagesAsync(string productId)
        {
            logger.LogInformation("Get images from productId, Service");
            var product = await productRepo.GetByProductIdAsync(productId);
            return await imageRepo.GetImageFilesAsync(product.ImageReferences);
        }
    }
}
