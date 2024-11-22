using Microsoft.AspNetCore.Mvc;
using TheFreckExchange.Server.Services;

namespace TheFreckExchange.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SiteController : ControllerBase
    {
        private readonly IDataGatheringService data;
        private readonly ILogger<SiteController> logger;
        public SiteController(IDataGatheringService data, ILogger<SiteController> logger)
        {
            this.data = data;
            this.logger = logger;
        }

        [HttpGet("{resource}")]
        public async Task<string> GetResourceAsync(string resource)
        {
            var desc = await data.GetDataAsync(resource);
            return desc;
        }
    }
}
