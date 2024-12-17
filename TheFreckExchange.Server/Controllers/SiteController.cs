using Microsoft.AspNetCore.Mvc;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Services;

namespace TheFreckExchange.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SiteController : ControllerBase
    {
        private readonly IDataGatheringService data;
        private readonly IConfigService configService;
        private readonly IProductService productService;
        private readonly ILogger<SiteController> logger;

        public SiteController(IDataGatheringService data, IConfigService configService, IProductService productService, ILogger<SiteController> logger)
        {
            this.data = data;
            this.configService = configService;
            this.productService = productService;
            this.logger = logger;
        }

        [HttpGet("anything")]
        public IActionResult Get() { return Ok("you made it here"); }

        [HttpPost("resource")]
        public async Task<string> GetResourceAsync([FromBody]Categories resource)
        {
            var desc = await data.GetDataAsync(resource);
            return desc;
        }

        [HttpGet("config")]
        public async Task<ConfigDTO> GetSiteConfig()
        {
            var config = await configService.GetConfigAsync();
            return config;
        }

        [HttpGet("config/background")]
        public async Task<ImageFile> GetBackgroundImageAsync()
        {
            return await productService.GetBackgroundImageAsync();
        }

        [HttpPost("config/set")]
        public async Task<ConfigDTO> SetConfigAsync([FromBody]ConfigDTO config)
        {
            return await configService.CreateNewAsync(config);
        }

        [HttpPut("config/update")]
        public async Task<ConfigDTO> UpdateConfigAsync(ConfigDTO config)
        {
            return await configService.UpdateConfigAsync(config);
        }

        [HttpDelete("config")]
        public async Task<ConfigDTO> DeleteCurrentConfig()
        {
            return await configService.DeleteConfigAsync();
        }
    }
}
