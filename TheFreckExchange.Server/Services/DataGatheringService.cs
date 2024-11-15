using HtmlAgilityPack;
using TheFreckExchange.Server.DTO;
using System.Text;

namespace TheFreckExchange.Server.Services
{
    public interface IDataGatheringService
    {
        Task<string> GetDataAsync(string hatname);
    }

    public class DataGatheringService : IDataGatheringService
    {
        private readonly HtmlWeb web;

        public DataGatheringService()
        {
            web = new HtmlWeb();
        }

        public async Task<string> GetDataAsync(string hatname)
        {
            var url = DescriptionUrls.GetUrl(hatname);
            var site = await web.LoadFromWebAsync(url);
            var ps = site.DocumentNode.QuerySelectorAll("p");
            var stringified = new StringBuilder();
            foreach (var p in ps) 
            {
                
                stringified.AppendLine(p.OuterHtml);
            }
            var text = stringified.ToString();
            return text;
        }
    }
}
