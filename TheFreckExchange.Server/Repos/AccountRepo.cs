using TheFreckExchange.Server.DTO;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace TheFreckExchange.Server.Repos
{
    public interface IAccountRepo
    {
        void Update(Account account);
        Task<Account> GetByAccountIdAsync(string accountId);
        Task<Account> GetByEmailAsync(string email);
        IEnumerable<Account> GetAllAccounts();
        Task CreateAsync(Account account);
        Task<Account> GetByUsernameAsync(string username);
        Task<IEnumerable<Account>> GetAdminsAsync();
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

        public void Update(Account account)
        {
            accountsCollection.ReplaceOne(a => a.AccountId == account.AccountId, account);
        }

        public async Task<Account> GetByAccountIdAsync(string accountId)
        {
            return (await accountsCollection.FindAsync<Account>(a => a.AccountId == accountId)).FirstOrDefault();
        }

        public async Task<Account> GetByEmailAsync(string email)
        {
            return (await accountsCollection.FindAsync<Account>(a => a.Email == email)).FirstOrDefault();
        }

        public IEnumerable<Account> GetAllAccounts()
        {
            var accounts = accountsCollection.AsQueryable();
            return accounts;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            var accounts = accountsCollection.AsQueryable();
            var retrieved = (await accountsCollection.FindAsync(a => a.Username == username)).FirstOrDefault();
            return retrieved;
        }

        public async Task<IEnumerable<Account>> GetAdminsAsync()
        {
            var admins = await accountsCollection.FindAsync(a => a.Permissions.Where(p => p.Type == PermissionType.Admin).Any());
            return admins.ToEnumerable();
        }
    }
}
