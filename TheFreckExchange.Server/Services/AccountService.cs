
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;

namespace TheFreckExchange.Server.Services
{
    public interface IAccountService
    {
        Task<Account> CreateAccountAsync(string name, string email, string username, string password, List<AccountPermissions> permissions);
        Task<Account> GetByAccountIdAsync(string guid);
        Task<Account> GetByEmailAsync(string email);
        Task<Account> GetByUsernameAsync(string username);
        Task<Account> AddToBalanceAsync(string acctId, string token, double balanceIncrease);
        Task<Account> MakePaymentAsync(string accountId, double payment);
        IEnumerable<Account> GetAllAccounts();
    }

    public class AccountService : IAccountService
    {
        private readonly IAccountRepo accountRepo;
        private readonly ILoginService loginService;
        private readonly ILogger<AccountService> logger;

        public AccountService(IAccountRepo accountRepo, ILoginService loginService, ILogger<AccountService> logger)
        {
            this.accountRepo = accountRepo;
            this.loginService = loginService;
            this.logger = logger;
        }

        public async Task<Account> AddToBalanceAsync(string username, string token, double balanceIncrease)
        {
            logger.LogInformation($"Add {balanceIncrease} to balance for {username}; Service");
            var acct = await accountRepo.GetByUsernameAsync(username);
            acct.Balance += balanceIncrease;
            accountRepo.Update(acct);
            acct.Username = string.Empty;
            acct.Password = string.Empty;
            acct.LoginToken = string.Empty;
            acct.PasswordSalt = new byte[64];
            acct.TokenSalt = new byte[64];
            return acct;
        }

        public async Task<Account> CreateAccountAsync(string name, string email, string username, string password, List<AccountPermissions> permissions)
        {
            logger.LogInformation($"Create account: {name}, {email}, {username}; Service");
            var account = new Account(name, username, email, permissions);

            var (passwordHash, passwordSalt) = loginService.CreateLogin(password);
            account.Password = passwordHash;
            account.PasswordSalt = passwordSalt;
            permissions.ForEach(p =>
            {
                p.Token = loginService.MakeHash(p.Type.ToString(), out var salt);
                p.TokenSalt = salt;
            });

            await accountRepo.CreateAsync(account);

            account.Username = string.Empty;
            account.Password = string.Empty;
            account.LoginToken = string.Empty;
            account.PasswordSalt = new byte[64];
            account.TokenSalt = new byte[64];
            account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);

            return account;
        }

        public async Task<Account> GetByAccountIdAsync(string accountId)
        {
            logger.LogInformation($"Get account by id: {accountId}; Service");
            var account = await accountRepo.GetByAccountIdAsync(accountId);
            account.Username = string.Empty;
            account.Password = string.Empty;
            account.LoginToken = string.Empty;
            account.PasswordSalt = new byte[64];
            account.TokenSalt = new byte[64];
            account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);
            return account;
        }

        public async Task<Account> GetByEmailAsync(string email)
        {
            logger.LogInformation($"Get account by email: {email}; Service");
            var account = await accountRepo.GetByEmailAsync(email);

            account.Username = string.Empty;
            account.Password = string.Empty;
            account.LoginToken = string.Empty;
            account.PasswordSalt = new byte[64];
            account.TokenSalt = new byte[64];
            account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);

            return account;
        }

        public IEnumerable<Account> GetAllAccounts()
        {
            logger.LogInformation("Get all accounts; Service");
            var accounts = accountRepo.GetAllAccounts().ToList();
            accounts.ForEach(a =>
            {
                a.Username = string.Empty;
                a.Password = string.Empty;
                a.PasswordSalt = new byte[64];
                a.LoginToken = string.Empty;
                a.TokenSalt = new byte[64];
                a.Permissions.ForEach(p => p.TokenSalt = new byte[64]);
            });
            return accounts;
        }

        public async Task<Account> MakePaymentAsync(string email, double payment)
        {
            logger.LogInformation($"Make {payment} payment to account: {email}; Service");
            var account = await accountRepo.GetByEmailAsync(email);
            account.Balance -= payment;
            accountRepo.Update(account);
            account.Username = string.Empty;
            account.Password = string.Empty;
            account.LoginToken = string.Empty;
            account.PasswordSalt = new byte[64];
            account.TokenSalt = new byte[64];
            account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);
            return account;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            logger.LogInformation($"Get account by username: {username}; Service");
            var account = await accountRepo.GetByUsernameAsync(username);

            account.Username = string.Empty;
            account.Password = string.Empty;
            account.LoginToken = string.Empty;
            account.PasswordSalt = new byte[64];
            account.TokenSalt = new byte[64];
            account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);

            return account;
        }
    }
}
