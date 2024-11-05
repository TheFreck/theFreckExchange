using Microsoft.AspNetCore.Mvc;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Services;

namespace Payment_Processing.Server.Controllers
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
        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var products = await productService.GetAllAsync();
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
            var product = await productService.CreateProductAsync(input.Name, input.Description, input.Attributes, input.Price, input.Credentials);
            return product;
        }

        /// <summary>
        /// Update the Name of Product
        /// </summary>
        /// <param name="oldName"></param>
        /// <param name="newName"></param>
        /// <returns></returns>
        [HttpPut("modify/name/{oldName}/{newName}/{username}")]
        public async Task<Product> ModifyName(string username, string oldName, string newName, LoginCredentials credentials)
        {
            var product = await productService.ModifyNameAsync(oldName, newName, credentials);
            return product;
        }

        /// <summary>
        /// Update the Price of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="price"></param>
        /// <returns></returns>
        [HttpPut("modify/price/{name}/{price}/{username}")]
        public async Task<Product> ModifyPrice(string username, string name, double price, LoginCredentials credentials)
        {
            var product = await productService.ModifyPriceAsync(name, price, credentials);
            return product;
        }

        /// <summary>
        /// Update the Description of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        [HttpPut("modify/description/{productName}")]
        public async Task<Product> ModifyDescription(string productName, [FromBody] ProductDTO product)
        {
            var prod = await productService.ModifyDescriptionAsync(productName, product.Description, product.Credentials);
            return prod;
        }

        // ITEMS

        /// <summary>
        /// Gets Items for given Product
        /// </summary>
        /// <returns></returns>
        [HttpGet("items/{name}")]
        public async Task<IEnumerable<Item>> GetItemsForProduct(string name)
        {
            var product = await productService.GetByNameAsync(name);
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
            var product = await productService.GetByNameAsync(productName);
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
        public async Task<IEnumerable<Item>> CreateItems(int qty, Item item)
        {
            var products = await productService.GetByNameAsync(item.Name);
            var items = await productService.CreateManyItemsAsync(item.Name,qty, item.Attributes, item.Credentials);
            return items; ;
        }

        /// <summary>
        /// To buy an Item on an Account and delete it from repo
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="username"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpDelete("item/buy")]
        public async Task<Item> PurchaseItem(Item item)
        {
            var account = await accountService.GetByUsernameAsync(item.Credentials.Username);

            if(await loginService.ValidateTokenAsync(item.Credentials.Username, item.Credentials.UserToken))
            {
                var items = new List<Item>();
                for(var i=0; i<item.Attributes.Count; i++)
                {
                    items.AddRange(await productService.GetByAttributeAsync(item.Name, item.Attributes[i].Type, item.Attributes[i].Value));
                }
                return await productService.PurchaseItem(items.FirstOrDefault(), item.Credentials);
            }
            else
            {
                return null;
            }
        }
    }
}
