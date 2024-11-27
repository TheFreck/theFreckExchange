using Machine.Specifications;
using TheFreckExchange.Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheFreckExchange.Server.DTO;
using Moq;
using It = Machine.Specifications.It;

namespace TheFreckExchange.Specs
{
    public class When_Getting_HTML_From_A_Site
    {
        Establish context = () =>
        {
            categories = new List<Categories>{
                new Categories
                {
                    Name = "First Category",
                    Description = "the first description",
                    URL = String.Empty,
                },
                new Categories
                {
                    Name = "Category with URL",
                    Description = "the description that will be ignored",
                    URL = "https://en.wikipedia.org/wiki/Bowler_hat"
                }
            };
            dataGatheringService = new DataGatheringService();
            outcomes = new List<string>();
        };

        Because of = () =>
        {
            for (var i = 0; i < categories.Count; i++)
            {
                outcomes.Add(dataGatheringService.GetDataAsync(categories[i]).GetAwaiter().GetResult());
            }
        };

        It Should_Return_A_String = () =>
        {
            outcomes[0].ShouldEqual(categories[0].Description);
            outcomes[0].ShouldNotEqual(categories[1].Description);
        };

        private static Mock<StringBuilder> stringBuilderMock;
        private static string descriptionMessage;
        private static List<Categories> categories;
        private static string inputUrl;
        private static IDataGatheringService dataGatheringService;
        private static List<string> outcomes;
    }
}
