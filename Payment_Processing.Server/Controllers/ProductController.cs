using Microsoft.AspNetCore.Mvc;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Services;
using System.Xml.Linq;

namespace Payment_Processing.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> logger;
        private readonly IProductService productService;

        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            this.productService = productService;
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
            var product = await productService.CreateProductAsync(input.Name, input.Description, input.Price);
            return product;
        }

        /// <summary>
        /// Update the Name of Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="newName"></param>
        /// <returns></returns>
        [HttpPut("modify/name/{name}/{newName}")]
        public async Task<Product> ModifyName(string name, string newName)
        {
            var product = await productService.ModifyNameAsync(name,newName);
            return product;
        }

        /// <summary>
        /// Update the Price of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="price"></param>
        /// <returns></returns>
        [HttpPut("modify/price/{name}/{price}")]
        public async Task<Product> ModifyPrice(string name, double price)
        {
            var product = await productService.ModifyPriceAsync(name, price);
            return product;
        }

        /// <summary>
        /// Update the Description of a Product
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        [HttpPut("modify/description/{name}")]
        public async Task<Product> ModifyDescription(string name, [FromBody] string description)
        {
            var product = await productService.ModifyDescriptionAsync(name, description);
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
        /// <param name="qty"></param>
        /// <param name="name"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpPost("items/create/{qty}/{name}")]
        public async Task<IEnumerable<Item>> CreateItems(int qty, string name, List<ItemAttribute> attributes)
        {
            var products = await productService.GetByNameAsync(name);
            var items = await productService.CreateManyItemsAsync(name,qty, attributes);
            return items; ;
        }

        /// <summary>
        /// To buy an Item on an Account and delete it from repo
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="email"></param>
        /// <param name="attributes"></param>
        /// <returns></returns>
        [HttpDelete("item/buy/{productName}/{email}")]
        public async Task<Item> PurchaseItem(string productName, string email, List<ItemAttribute> attributes)
        {
            var items = new List<Item>();
            for(var i=0; i<attributes.Count; i++)
            {
                items.AddRange(await productService.GetByAttributeAsync(productName, attributes[i].Type, attributes[i].Value));
            }
            return await productService.PurchaseItem(email, items.FirstOrDefault());
        }
    }
}
