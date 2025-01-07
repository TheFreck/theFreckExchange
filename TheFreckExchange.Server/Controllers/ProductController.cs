using Microsoft.AspNetCore.Mvc;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Services;
using System.Linq;
using System.Net;
using System.Xml.Linq;

namespace TheFreckExchange.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> logger;
        private readonly IProductService productService;
        private readonly IAccountService accountService;
        private readonly ILoginService loginService;

        public ProductController(IProductService productService, IAccountService accountService, ILoginService loginService, ILogger<ProductController> logger)
        {
            this.productService = productService;
            this.accountService = accountService;
            this.loginService = loginService;
            this.logger = logger;
        }

        // PRODUCTS

        /// <summary>
        /// Gets all Products
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<Product> GetAll()
        {
            var products = productService.GetAll();
            return products;
        }

        /// <summary>
        /// Gets a Product by given name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpGet("name/{name}")]
        public async Task<Product> GetByName(string name)
        {
            var product = await productService.GetByNameAsync(name);
            return product;
        }

        /// <summary>
        /// Create a new product
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<Product> CreateProduct(ProductDTO input)
        {
            if(input.Credentials == null)
            {
                return new Product
                {
                    Name = "Missing or incorrect credentials",
                    ProductDescription = "Missing or incorrect credentials",
                    Price = input.Price,
                    ProductId = String.Empty,
                    PrimaryImageReference = String.Empty,
                };
            }
            else if (await loginService.ValidateTokenAsync(input.Credentials.Username, input.Credentials.LoginToken))
            {
                var product = await productService.CreateProductAsync(input.Name, input.Description, input.Attributes, input.Price, input.Credentials, input.ImageReferences, input.PrimaryImageReference);
                return product;
            }
            else return new Product
            {
                Name = "Missing or incorrect credentials",
                Price = input.Price,
                ProductDescription = input.Description,
                ProductId = Guid.Empty.ToString(),
                PrimaryImageReference = input.PrimaryImageReference
            };
        }

        /// <summary>
        /// To modify a product. Cannot modify [productId, name, id];
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPut("modify/product")]
        public async Task<Product> ModifyProduct([FromBody] ProductDTO input)
        {
            if(input.Credentials == null)
            {
                return new Product
                {
                    Name = "Missing or incorrect credentials",
                    Price = 0,
                    ProductDescription = "Missing or incorrect credentials",
                    ProductId = Guid.Empty.ToString(),
                    PrimaryImageReference = String.Empty
                };
            }
            else if (await loginService.ValidateTokenAsync(input.Credentials.Username, input.Credentials.LoginToken))
            {
                return await productService.ModifyProductAsync(input);
            }
            return new Product
            { 
                Name = "Couldn't modify the product",
                Price = input.Price,
                ProductDescription = input.Description,
                ProductId = Guid.Empty.ToString(),
                PrimaryImageReference = String.Empty
            };
        }

        // ITEMS

        /// <summary>
        /// Gets Items for given Product
        /// </summary>
        /// <returns></returns>
        [HttpGet("items/{name}")]
        public async Task<List<Item>> GetItemsForProduct(string name)
        {
            var items = await productService.GetItemsAsync(name);
            return items;
        }

        /// <summary>
        /// Gets all items with given attribute
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="attribute"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpGet("items/product/{productName}/attribute/{attribute}/{value}")]
        public async Task<IEnumerable<Item>> GetItemsByAttribute(string productName, string attribute, string value)
        {
            var items = await productService.GetByAttributeAsync(productName, attribute, value);
            return items;
        }

        /// <summary>
        /// Gets all Attributes for existing items for a given product
        /// </summary>
        /// <param name="productName"></param>
        /// <returns></returns>
        [HttpGet("items/product/{productName}/attributes")]
        public async Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName)
        {
            var groups = await productService.GetAttributesAsync(productName);
            return groups;
        }

        /// <summary>
        /// Gets all available attributes for a given product
        /// </summary>
        /// <param name="productName"></param>
        /// <returns></returns>
        [HttpGet("items/availableAttributes/{productName}")]
        public async Task<IEnumerable<string>> GetAvailableAttributes(string productName)
        {
            var attributes = await productService.GetAvailableAttributes(productName);
            return attributes;
        }

        /// <summary>
        /// Creates qty items with given attributes
        /// </summary>
        /// <param name="username"></param>
        /// <param name="qty"></param>
        /// <param name="productName"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpPost("items/create/{qty}")]
        public async Task<Item> CreateItems(int qty, Item item)
        {
            if(item.Credentials == null)
            {
                item.Name = "Missing or incorrect credentials";
                item.ProductDescription = "Missing or incorrect credentials";
                return item;
            }
            var items = await productService.CreateItemsAsync(item.ProductId,qty, item.Attributes, item.Credentials);
            return items; ;
        }

        /// <summary>
        /// To buy an Item on an Account and delete it from repo
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="username"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpPost("item/buy/{qty}")]
        public async Task<Item> PurchaseItem([FromBody]ItemDTO item, int qty)
        {
            if(item.Credentials == null)
            {
                return new Item
                {
                    Name = "Missing or incorrect credentials",
                    ProductDescription = "Missing or incorrect credentials",
                    Price = 0,
                    ProductId = Guid.Empty.ToString(),
                    SKU = "Missing or incorrect credentials"
                };
            }
            var account = await accountService.GetByUsernameAsync(item.Credentials.Username);

            if(await loginService.ValidateTokenAsync(item.Credentials.Username, item.Credentials.LoginToken))
            {
                var product = await productService.GetByNameAsync(item.Name);
                var itemReturned = await productService.PurchaseItem(item, qty);
                if (itemReturned.Quantity >= qty) return itemReturned;
                return new Item
                {
                    Name = item.Name,
                    ProductDescription = "Out of Stock",
                    Price = product.Price,
                    ProductId = product.ProductId,
                    SKU = "Out of Stock"
                };
            }
            else
            {
                return new Item
                {
                    Name = "Missing or incorrect credentials",
                    ProductDescription = "Missing or incorrect credentials",
                    Price = 0,
                    ProductId = Guid.Empty.ToString(),
                    SKU = "Missing or incorrect credentials"
                };
            }
        }

        [HttpPost("image/uploadImage/{productId}")]
        public async Task<IActionResult> UploadImagesForProductsAsync([FromForm]List<IFormFile> images, string productId)
        {
            await productService.UpdateProductWithImageAsync(productId, images);
            return Ok();
        }

        [HttpPost("imageItems")]
        public async Task<IEnumerable<ImageFile>> GetProductImages(IEnumerable<string> imageIds)
        {
            return await productService.GetImagesAsync(imageIds);
        }

        [HttpGet("images")]
        public IEnumerable<ImageFile> GetAllImages()
        {
            var images = productService.GetAllImages().ToList();
            return images;
        }

        [HttpGet("images/site")]
        public async Task<IEnumerable<ImageFile>> GetSiteImages()
        {
            var images = await productService.GetAllSiteImagesAsync();
            return images;
        }

        [HttpPost("images/upload")]
        public async Task<IActionResult> UploadImages([FromForm]List<IFormFile> images)
        {
            var imagesUploaded = await productService.UploadImagesAsync(images);
            return Ok(imagesUploaded);
        }
    }
}
