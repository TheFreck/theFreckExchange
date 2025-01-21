using TheFreckExchange.Server.DTO;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace TheFreckExchange.Server.Repos
{
    public interface IConfigRepo
    {
        Task<ConfigDTO> DeleteConfigAsync();
        Task<ConfigDTO> GetConfigAsync();
        Task ReplaceConfigAsync(ConfigDTO configDTO);
    }

    public class ConfigRepo : IConfigRepo
    {
        private readonly IMongoCollection<ConfigDTO> configCollection;
        private readonly ILogger<ConfigRepo> logger;

        public ConfigRepo(IOptions<MongoSettings> settings, ILogger<ConfigRepo> logger)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            configCollection = mongoDatabase.GetCollection<ConfigDTO>(settings.Value.ConfigCollectionName);
            this.logger = logger;
            logger.LogInformation("Constructed Config Repo");
        }

        public async Task<ConfigDTO> DeleteConfigAsync()
        {
            logger.LogInformation("deleting config");
            return await configCollection.FindOneAndDeleteAsync(c => c != null);
        }

        public async Task<ConfigDTO> GetConfigAsync()
        {
            var config = await configCollection.FindAsync(c => c != null);
            logger.LogInformation("getting config");
            return config.FirstOrDefault();
        }

        public async Task ReplaceConfigAsync(ConfigDTO configDTO)
        {
            logger.LogInformation("replace config");
            if((await configCollection.FindAsync(c => c != null)).Any())
            {
                await configCollection.DeleteManyAsync(c => c != null);
            }
            configCollection.InsertOne(configDTO);
        }
    }
}
