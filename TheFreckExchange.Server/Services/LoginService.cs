using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Template;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;
using System.Security.Cryptography;
using System.Text;

namespace TheFreckExchange.Server.Services
{
    public interface ILoginService
    {
        (string hash, byte[] salt) CreateLogin(string request);
        Task<Account> LoginAsync(string username, string password);
        Task<bool> LogOutAsync(string username);
        string MakeHash(string preHash, out byte[] salt);
        Task<bool> ValidatePermissionsAsync(Account account, PermissionType admin, string token);
        Task<bool> ValidateTokenAsync(string username, string token);
        bool VerifyHash(string password, string hashword, byte[] salt);
    }

    public class LoginService : ILoginService
    {
        private readonly IAccountRepo accountRepo;
        public LoginService(IAccountRepo accountRepo)
        {
            this.accountRepo = accountRepo;
        }

        public (string hash, byte[] salt) CreateLogin(string request)
        {
            var passwordHash = MakeHash(request, out var passwordSalt);
            return (passwordHash, passwordSalt);
        }

        public async Task<Account> LoginAsync(string username, string password)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            if(account.PasswordSalt != null)
            {
                if(account != null && VerifyHash(password, account.Password, account.PasswordSalt))
                {
                    account.LoginToken = MakeHash(Guid.NewGuid().ToString(),out var tokenSalt);
                    account.TokenSalt = tokenSalt;
                    accountRepo.Update(account);
                    return account;
                }
                return new Account();
            }
            return new Account();
        }

        public async Task<bool> LogOutAsync(string username)
        {
            try
            {
                if (username == null || username == "undefined") return true;
                var account = await accountRepo.GetByUsernameAsync(username);
                account.LoginToken = Guid.Empty.ToString();
                account.TokenSalt = new byte[64];
                accountRepo.Update(account);
                return true;
            }
            catch (Exception)
            {
                return true;
            }
        }

        public string MakeHash(string preHash, out byte[] salt)
        {
            const int keySize = 64;
            const int iterations = 350000;
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(preHash),
                salt,
                iterations,
                HashAlgorithmName.SHA512,
                keySize);
            return Convert.ToHexString(hash);
        }

        public async Task<bool> ValidatePermissionsAsync(Account account, PermissionType permission, string token)
        {
            var gotten = await accountRepo.GetByUsernameAsync(account.Username);
            if (token == String.Empty || account.LoginToken == string.Empty) return false;

            if (account.Permissions?.Where(p => p.Type == permission)?.FirstOrDefault()?.Token == token) return true;
            return false;
        }

        public async Task<bool> ValidateTokenAsync(string username, string token)
        {
            var account = await accountRepo.GetByUsernameAsync(username);
            var isValid = account != null && account.LoginToken == token;
            return isValid;
        }

        public bool VerifyHash(string password, string hashword, byte[] salt)
        {
            const int keySize = 64;
            const int iterations = 350000;
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                HashAlgorithmName.SHA512,
                keySize);
            return Convert.ToHexString(hash) == hashword;
        }
    }
}
