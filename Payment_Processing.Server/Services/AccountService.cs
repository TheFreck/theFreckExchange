
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using System;
using System.Threading.Tasks;

namespace Payment_Processing.Server.Services
{
    public interface IAccountService
    {
        Task<Account> CreateAccountAsync(string name, string email);
        Task<Account> GetAccountAsync(string guid);
        Task<Account> AddToBalanceAsync(string acctId, double balanceIncrease);
        Task<Account> MakePaymentAsync(string accountId, double payment);
        Task<IEnumerable<Account>> GetAllAccountsAsync();
    }

    public class AccountService : IAccountService
    {
        private readonly IAccountRepo accountRepo;

        public AccountService(IAccountRepo accountRepo)
        {
            this.accountRepo = accountRepo;
        }

        public async Task<Account> AddToBalanceAsync(string acctId, double balanceIncrease)
        {
            var acct = await accountRepo.GetAccountAsync(acctId);
            acct.Balance += balanceIncrease;
            accountRepo.CreateOrUpdateAsync(acct);
            return new Account
            {
                AccountId = acct.AccountId,
                Name = acct.Name,
                Email = acct.Email,
                Balance = acct.Balance,
                DateOpened = acct.DateOpened
            };
        }

        public async Task<Account> CreateAccountAsync(string name, string email)
        {
            var account = new Account
            {
                AccountId = Guid.NewGuid().ToString(),
                Name = name,
                Email = email,
                Balance = 0,
                DateOpened = DateTime.Now,
            };

            await accountRepo.CreateOrUpdateAsync(account);

            return account;
        }

        public async Task<Account> GetAccountAsync(string accountId)
        {
            var account = await accountRepo.GetAccountAsync(accountId);
            return new Account
            {
                AccountId = account.AccountId,
                Name = account.Name,
                Email = account.Email,
                Balance = account.Balance,
                DateOpened = account.DateOpened
            };
        }

        public async Task<IEnumerable<Account>> GetAllAccountsAsync()
        {
            var accountEntities = await accountRepo.GetAllAccountsAsync();
            var accounts = new List<Account>();
            foreach(var account in accountEntities)
            {
                accounts.Add(new Account
                {
                    AccountId = account.AccountId,
                    Name = account.Name,
                    Email = account.Email,
                    Balance = account.Balance,
                    DateOpened = account.DateOpened
                });
            }
            return accounts;
        }

        public async Task<Account> MakePaymentAsync(string accountId, double payment)
        {
            var account = await accountRepo.GetAccountAsync(accountId);
            account.Balance -= payment;
            accountRepo.CreateOrUpdateAsync(account);
            return account;
        }
    }
}
