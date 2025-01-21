using TheFreckExchange.Server.DTO;
using System.Text;
using AngleSharp;

namespace TheFreckExchange.Server.Services
{
    public interface IDataGatheringService
    {
        Task<string> GetDataAsync(Categories category);
    }

    public class DataGatheringService : IDataGatheringService
    {
        private readonly AngleSharp.IConfiguration config;
        private readonly ILogger<DataGatheringService> logger;

        public DataGatheringService(ILogger<DataGatheringService> logger)
        {
            config = Configuration.Default;
            this.logger = logger;
        }

        public async Task<string> GetDataAsync(Categories category)
        {
            logger.LogInformation($"Getting data by category, Service");
            if(category.URL != null && category.URL != string.Empty)
            {
                using (HttpClient client = new HttpClient()) 
                {
                    HttpResponseMessage response = await client.GetAsync(category.URL);
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
            }
            else
            {
                return category.Description;
            }
        }
    }
}
