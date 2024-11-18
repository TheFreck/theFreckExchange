using Machine.Specifications;
using TheFreckExchange.Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheFreckExchange.Specs
{
    public class When_Getting_HTML_From_A_Site
    {
        Establish context = () =>
        {
            inputUrl = "https://en.wikipedia.org/wiki/Bowler_hat";
            dataGatheringService = new DataGatheringService();
        };

        Because of = () => outcome = dataGatheringService.GetDataAsync(inputUrl).GetAwaiter().GetResult();

        It Should_Return_A_String = () => outcome.ShouldNotBeNull();

        private static string inputUrl;
        private static IDataGatheringService dataGatheringService;
        private static string outcome;
    }
}
