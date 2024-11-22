//using HtmlAgilityPack;
using TheFreckExchange.Server.DTO;
using System.Text;
using AngleSharp;

namespace TheFreckExchange.Server.Services
{
    public interface IDataGatheringService
    {
        Task<string> GetDataAsync(string hatname);
    }

    public class DataGatheringService : IDataGatheringService
    {
        private readonly AngleSharp.IConfiguration config;

        public DataGatheringService()
        {
            config = Configuration.Default;
        }

        public async Task<string> GetDataAsync(string hatname)
        {
            var url = DescriptionUrls.GetUrl(hatname);

            using (HttpClient client = new HttpClient()) 
            {
                HttpResponseMessage response = await client.GetAsync(url);
                string htmlContent = await response.Content.ReadAsStringAsync();

                var config = Configuration.Default.WithDefaultLoader();
                var context = BrowsingContext.New(config);
                var document = await context.OpenAsync(req => req.Content(htmlContent));
                var ps = document.QuerySelectorAll("p");

                var stringified = new StringBuilder();
                foreach (var p in ps)
                {

                    stringified.AppendLine(p.OuterHtml);
                }
                var text = stringified.ToString();
                return text;
            }

            //var site = await web.LoadFromWebAsync(url);
            //var ps = site.DocumentNode.QuerySelectorAll("p");

        }
    }
}
