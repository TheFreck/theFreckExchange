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
        [HttpPost("create/{username}")]
        public async Task<Product> CreateProduct(ProductDTO input, string username)
        {
            var product = await productService.CreateProductAsync(username, input.Name, input.Description, input.Price);
            return product;
        }

        /// <summary>
        /// Update the Name of Product
        /// </summary>
        /// <param name="oldName"></param>
        /// <param name="newName"></param>
        /// <returns></returns>
        [HttpPut("modify/name/{oldName}/{newName}/{username}")]
        public async Task<Product> ModifyName(string username, string oldName, string newName)
        {
            var product = await productService.ModifyNameAsync(username, oldName, newName);
            return product;
        }

        /// <summary>
        /// Update the Price of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="price"></param>
        /// <returns></returns>
        [HttpPut("modify/price/{name}/{price}/{username}")]
        public async Task<Product> ModifyPrice(string username, string name, double price)
        {
            var product = await productService.ModifyPriceAsync(username, name, price);
            return product;
        }

        /// <summary>
        /// Update the Description of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        [HttpPut("modify/description/{productName}")]
        public async Task<Product> ModifyDescription(string username, string productName, [FromBody] string description)
        {
            var product = await productService.ModifyDescriptionAsync(username, productName, description);
            return product;
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
        public async Task<IEnumerable<Item>> GetItemsByAttribute(string productName, AttributeType attribute, string value)
        {
            var product = await productService.GetByNameAsync(productName);
            var items = await productService.GetByAttributeAsync(productName, attribute, value);
            return items;
        }

        /// <summary>
        /// Gets all Attributes used for a Product
        /// </summary>
        /// <param name="productName"></param>
        /// <returns></returns>
        [HttpGet("items/product/{productName}/allAttributes")]
        public async Task<IEnumerable<GroupedAttributes>> GetAttributesAsync(string productName)
        {
            var groups = await productService.GetAttributesAsync(productName);
            return groups;
        }

        /// <summary>
        /// Creates qty items with given attributes
        /// </summary>
        /// <param name="username"></param>
        /// <param name="qty"></param>
        /// <param name="productName"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpPost("items/create/{qty}/{productName}/{username}")]
        public async Task<IEnumerable<Item>> CreateItems(string username, int qty, string productName, List<ItemAttribute> attributes)
        {
            var products = await productService.GetByNameAsync(productName);
            var items = await productService.CreateManyItemsAsync(username, productName,qty, attributes);
            return items; ;
        }

        /// <summary>
        /// To buy an Item on an Account and delete it from repo
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="username"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpDelete("item/buy/{productName}/{username}")]
        public async Task<Item> PurchaseItem(string productName, string username, string token, List<ItemAttribute> attributes)
        {
            var account = await accountService.GetByUsernameAsync(username);

            if(await loginService.ValidateTokenAsync(username, token))
            {
                var items = new List<Item>();
                for(var i=0; i<attributes.Count; i++)
                {
                    items.AddRange(await productService.GetByAttributeAsync(productName, attributes[i].Type, attributes[i].Value));
                }
                return await productService.PurchaseItem(username, token, items.FirstOrDefault());
            }
            else
            {
                return null;
            }
        }
    }
}
