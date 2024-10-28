using Payment_Processing.Server.DTO;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace Payment_Processing.Server.Repos
{
    public interface IAccountRepo
    {
        Task CreateOrUpdateAsync(Account account);
        Task<Account> GetAccountAsync(string accountId);
        Task<IEnumerable<Account>> GetAllAccountsAsync();
    }

    public class AccountRepo : IAccountRepo
    {
        private readonly IMongoCollection<Account> accountsCollection;

        public AccountRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            accountsCollection = mongoDatabase.GetCollection<Account>(settings.Value.CollectionName);
        }

        public async Task CreateOrUpdateAsync(Account account)
        {
            await accountsCollection.InsertOneAsync(account);
        }

        public async Task<Account> GetAccountAsync(string accountId)
        {
            return accountsCollection.FindAsync<Account>(a => a.AccountId == accountId).Result.FirstOrDefault();
        }

        public async Task<IEnumerable<Account>> GetAllAccountsAsync()
        {
            var accounts = accountsCollection.AsQueryable();
            return accounts;
        }
    }
}
