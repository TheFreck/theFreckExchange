
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using System;
using System.Threading.Tasks;

namespace Payment_Processing.Server.Services
{
    public interface IAccountService
    {
        Task<Account> CreateAccountAsync(string name, string email, string username, string password);
        Task<Account> GetByAccountIdAsync(string guid);
        Task<Account> GetByEmailAsync(string email);
        Task<Account> GetByUsernameAsync(string username);
        Task<Account> AddToBalanceAsync(string acctId, double balanceIncrease);
        Task<Account> MakePaymentAsync(string accountId, double payment);
        Task<IEnumerable<Account>> GetAllAccountsAsync();
    }

    public class AccountService : IAccountService
    {
        private readonly IAccountRepo accountRepo;
        private readonly ILoginService loginService;

        public AccountService(IAccountRepo accountRepo, ILoginService loginService)
        {
            this.accountRepo = accountRepo;
            this.loginService = loginService;
        }

        public async Task<Account> AddToBalanceAsync(string username, double balanceIncrease)
        {
            var acct = await accountRepo.GetByUsernameAsync(username);
            acct.Balance += balanceIncrease;
            await accountRepo.UpdateAsync(acct);
            return acct;
        }

        public async Task<Account> CreateAccountAsync(string name, string email, string username, string password)
        {
            var account = new Account(name, username, password, email);

            var (passwordHash,passwordSalt) = loginService.CreateLogin(password);
            account.Password = passwordHash;
            account.PasswordSalt = passwordSalt;

            await accountRepo.CreateAsync(account);

            return account;
        }

        public async Task<Account> GetByAccountIdAsync(string accountId)
        {
            return await accountRepo.GetByAccountIdAsync(accountId);
        }

        public async Task<Account> GetByEmailAsync(string email)
        {
            var account = await accountRepo.GetByEmailAsync(email);
            return account;
        }



        public async Task<IEnumerable<Account>> GetAllAccountsAsync()
        {
            return await accountRepo.GetAllAccountsAsync();
        }

        public async Task<Account> MakePaymentAsync(string email, double payment)
        {
            var account = await accountRepo.GetByEmailAsync(email);
            account.Balance -= payment;
            await accountRepo.UpdateAsync(account);
            return account;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            return await accountRepo.GetByUsernameAsync(username);
        }

        public async Task<Account> LoginAsync(string username, string password)
        {

            throw new NotImplementedException();
        }
    }
}
