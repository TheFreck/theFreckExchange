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

        public ConfigRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            configCollection = mongoDatabase.GetCollection<ConfigDTO>(settings.Value.ConfigCollectionName);
        }

        public async Task<ConfigDTO> DeleteConfigAsync()
        {
            return await configCollection.FindOneAndDeleteAsync(c => c != null);
        }

        public async Task<ConfigDTO> GetConfigAsync()
        {
            var config = await configCollection.FindAsync(c => c != null);
            return config.FirstOrDefault();
        }

        public async Task ReplaceConfigAsync(ConfigDTO configDTO)
        {
            if((await configCollection.FindAsync(c => c != null)).Any())
            {
                await configCollection.DeleteManyAsync(c => c != null);
            }
            configCollection.InsertOne(configDTO);
        }
    }
}
