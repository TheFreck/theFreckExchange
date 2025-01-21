using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TheFreckExchange.Server.DTO;

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
        private readonly ILogger<AccountRepo> logger;

        public AccountRepo(IOptions<MongoSettings> settings, ILogger<AccountRepo> logger)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            accountsCollection = mongoDatabase.GetCollection<Account>(settings.Value.AccountCollectionName);
            this.logger = logger;
            logger.LogInformation("Constructed Account Repo");
        }

        public async Task CreateAsync(Account account)
        {
            logger.LogInformation($"Create account: {account.Username}");
            await accountsCollection.InsertOneAsync(account);
        }

        public void Update(Account account)
        {
            logger.LogInformation($"Updated account: {account.Username}");
            accountsCollection.ReplaceOne(a => a.AccountId == account.AccountId, account);
        }

        public async Task<Account> GetByAccountIdAsync(string accountId)
        {
            logger.LogInformation($"Get account by id: {accountId}");
            return (await accountsCollection.FindAsync<Account>(a => a.AccountId == accountId)).FirstOrDefault();
        }

        public async Task<Account> GetByEmailAsync(string email)
        {
            logger.LogInformation($"Get account by email: {email}");
            return (await accountsCollection.FindAsync<Account>(a => a.Email == email)).FirstOrDefault();
        }

        public IEnumerable<Account> GetAllAccounts()
        {
            logger.LogInformation("Get all accounts");
            var accounts = accountsCollection.AsQueryable();
            return accounts;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            logger.LogInformation($"Get account by username: {username}");
            var accounts = accountsCollection.AsQueryable();
            var retrieved = (await accountsCollection.FindAsync(a => a.Username == username)).FirstOrDefault();
            return retrieved;
        }

        public async Task<IEnumerable<Account>> GetAdminsAsync()
        {
            logger.LogInformation("Get admins");
            var admins = await accountsCollection.FindAsync(a => a.Permissions.Where(p => p.Type == PermissionType.Admin).Any());
            return admins.ToEnumerable();
        }
    }
}
