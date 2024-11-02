using Payment_Processing.Server.DTO;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace Payment_Processing.Server.Repos
{
    public interface IAccountRepo
    {
        Task UpdateAsync(Account account);
        Task<Account> GetByAccountIdAsync(string accountId);
        Task<Account> GetByEmailAsync(string email);
        Task<IEnumerable<Account>> GetAllAccountsAsync();
        Task CreateAsync(Account account);
        Task<Account> GetByUsernameAsync(string username);
    }

    public class AccountRepo : IAccountRepo
    {
        private readonly IMongoCollection<Account> accountsCollection;

        public AccountRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            accountsCollection = mongoDatabase.GetCollection<Account>(settings.Value.AccountCollectionName);
        }

        public async Task CreateAsync(Account account)
        {
            await accountsCollection.InsertOneAsync(account);
        }

        public async Task UpdateAsync(Account account)
        {
            accountsCollection.ReplaceOne(a => a.AccountId == account.AccountId, account);
        }

        public async Task<Account> GetByAccountIdAsync(string accountId)
        {
            return accountsCollection.FindAsync<Account>(a => a.AccountId == accountId).Result.FirstOrDefault();
        }

        public async Task<Account> GetByEmailAsync(string email)
        {
            return (await accountsCollection.FindAsync<Account>(a => a.Email == email)).FirstOrDefault();
        }

        public async Task<IEnumerable<Account>> GetAllAccountsAsync()
        {
            var accounts = accountsCollection.AsQueryable();
            return accounts;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            var retrieved = (await accountsCollection.FindAsync(a => a.Username == username)).FirstOrDefault();
            return retrieved;
        }
    }
}
