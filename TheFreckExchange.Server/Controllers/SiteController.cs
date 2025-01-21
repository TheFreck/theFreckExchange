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

        [HttpPost("resource")]
        public async Task<string> GetResourceAsync([FromBody]Categories resource)
        {
            logger.LogInformation($"Get resource, Controller");
            var desc = await data.GetDataAsync(resource);
            return desc;
        }

        [HttpGet("config")]
        public async Task<ConfigDTO> GetSiteConfig()
        {
            logger.LogInformation($"Get site config, Controller");
            var config = await configService.GetConfigAsync();
            return config;
        }

        [HttpGet("config/background")]
        public async Task<ImageFile> GetBackgroundImageAsync()
        {
            logger.LogInformation("Get background images, Controller");
            return await productService.GetBackgroundImageAsync();
        }

        [HttpPost("config/set")]
        public async Task<ConfigDTO> SetConfigAsync([FromBody]ConfigDTO config)
        {
            logger.LogInformation($"Set config: {config.ConfigId}, Controller");
            return await configService.CreateNewAsync(config);
        }

        [HttpPut("config/update")]
        public async Task<ConfigDTO> UpdateConfigAsync(ConfigDTO config)
        {
            logger.LogInformation("Update config, Controller");
            return await configService.UpdateConfigAsync(config);
        }

        [HttpDelete("config")]
        public async Task<ConfigDTO> DeleteCurrentConfig()
        {
            logger.LogInformation("Delete config");
            return await configService.DeleteConfigAsync();
        }
    }
}
