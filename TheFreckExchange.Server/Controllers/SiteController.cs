using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using TheFreckExchange.Server.Services;

namespace TheFreckExchange.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SiteController : ControllerBase
    {
        private readonly IDataGatheringService data;
        public SiteController(IDataGatheringService data)
        {
            this.data = data;
        }

        [HttpGet("{resource}")]
        public async Task<string> GetResourceAsync(string resource)
        {
            var desc = await data.GetDataAsync(resource);
            return desc;
        }
    }
}
