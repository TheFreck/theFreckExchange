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

        [HttpGet("{resource}")]
        public async Task<string> GetResourceAsync(string resource)
        {
            var desc = await data.GetDataAsync(resource);
            return desc;
        }

        [HttpGet("config")]
        public async Task<ConfigDTO> GetSiteConfig()
        {
            return await configService.GetConfigAsync();
        }

        [HttpPost("config/set")]
        public ConfigDTO SetConfigAsync(ConfigDTO config)
        {
            return configService.CreateNew(config);
        }

        [HttpPut("config/update")]
        public async Task<ConfigDTO> UpdateConfigAsync(ConfigDTO config)
        {
            return await configService.UpdateConfigAsync(config);
        }
    }
}
