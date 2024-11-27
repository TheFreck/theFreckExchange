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
        private readonly ILogger<SiteController> logger;

        public SiteController(IDataGatheringService data, IConfigService configService, ILogger<SiteController> logger)
        {
            this.data = data;
            this.configService = configService;
            this.logger = logger;
        }

        [HttpGet("resource")]
        public async Task<string> GetResourceAsync([FromBody] Categories resource)
        {
            var desc = await data.GetDataAsync(resource);
            return desc;
        }

        [HttpGet("config/{configId}")]
        public async Task<ConfigDTO> GetSiteConfig(string configId)
        {
            if (String.IsNullOrWhiteSpace(configId)) return new ConfigDTO();
            var config = await configService.GetConfigAsync(configId);
            if (String.IsNullOrWhiteSpace(config?.ConfigId)) return new ConfigDTO();
            return config;
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
    }
}
