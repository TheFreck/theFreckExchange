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

        /// <summary>
        /// Products
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var products = await productService.GetAllAsync();
            return products;
        }

        [HttpGet("name/{name}")]
        public async Task<Product> GetByName(string name)
        {
            var product = await productService.GetByNameAsync(name);
            return product;
        }

        [HttpPost("create")]
        public async Task<Product> CreateProduct(ProductDTO input)
        {
            var product = await productService.CreateProductAsync(input.Name, input.Description, input.Price);
            return product;
        }

        [HttpPut("modify/name/{name}/{newName}")]
        public async Task<Product> ModifyName(string name, string newName)
        {
            var product = await productService.ModifyNameAsync(name,newName);
            return product;
        }

        [HttpPut("modify/price/{name}/{price}")]
        public async Task<Product> ModifyPrice(string name, double price)
        {
            var product = await productService.ModifyPriceAsync(name, price);
            return product;
        }

        [HttpPut("modify/description/{name}")]
        public async Task<Product> ModifyDescription(string name, [FromBody] string description)
        {
            var product = await productService.ModifyDescriptionAsync(name, description);
            return product;
        }

        /// <summary>
        /// Items
        /// </summary>
        /// <returns></returns>
        [HttpGet("items/{name}")]
        public async Task<IEnumerable<Item>> GetItemsForProduct(string name)
        {
            var product = await productService.GetByNameAsync(name);
            var items = await productService.GetItemsAsync(name);
            return items;
        }

        [HttpGet("items/product/{productName}/attribute/{attribute}/{value}")]
        public async Task<IEnumerable<Item>> GetItemsByAttribute(string productName, AttributeType attribute, string value)
        {
            var product = await productService.GetByNameAsync(productName);
            var items = await productService.GetByAttributeAsync(productName, attribute, value);
            return items;
        }

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
