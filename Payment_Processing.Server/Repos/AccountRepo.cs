using Payment_Processing.Server.DTO;

namespace Payment_Processing.Server.Repos
{
    public interface IAccountRepo
    {
        void CreateOrUpdate(Account account);
        Task<Account> GetAccountAsync(Guid account1Id);
    }

    public class AccountRepo : IAccountRepo
    {
        public void CreateOrUpdate(Account account)
        {
            throw new NotImplementedException();
        }

        public async Task<Account> GetAccountAsync(Guid account1Id)
        {
            throw new NotImplementedException();
        }
    }
}
