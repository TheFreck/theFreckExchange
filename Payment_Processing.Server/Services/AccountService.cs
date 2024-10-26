
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using System.Threading.Tasks;

namespace Payment_Processing.Server.Services
{
    public interface IAccountService
    {
        Account CreateAccount(string name, string email);
        Task<Account> GetAccountAsync(Guid guid);
        Task<Account> AddToBalanceAsync(Guid acctId, double balanceIncrease);
        Task<Account> MakePaymentAsync(Guid accountId, double payment);
    }

    public class AccountService
    {
        private readonly IAccountRepo accountRepo;

        public AccountService(IAccountRepo accountRepo)
        {
            this.accountRepo = accountRepo;
        }

        public async Task<Account> AddToBalanceAsync(Guid acctId, double balanceIncrease)
        {
            var acct = await accountRepo.GetAccountAsync(acctId);
            acct.Balance += balanceIncrease;
            accountRepo.CreateOrUpdate(acct);
            return acct;
        }

        public Account CreateAccount(string name, string email)
        {
            var account = new Account
            {
                AccountId = Guid.NewGuid(),
                Name = name,
                Email = email,
                Balance = 0,
                DateOpened = DateTime.Now,
            };

            accountRepo.CreateOrUpdate(account);
            return account;
        }

        public async Task<Account> GetAccountAsync(Guid guid)
        {
            return await accountRepo.GetAccountAsync(guid);
        }

        public async Task<Account> MakePaymentAsync(Guid accountId, double payment)
        {
            var account = await GetAccountAsync(accountId);
            account.Balance -= payment;
            accountRepo.CreateOrUpdate(account);
            return account;
        }
    }
}
