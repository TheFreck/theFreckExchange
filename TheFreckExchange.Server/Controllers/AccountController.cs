using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Services;

namespace TheFreckExchange.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<AccountController> logger;
        private readonly IAccountService accountService;
        private readonly ILoginService loginService;

        public AccountController(ILogger<AccountController> logger, IAccountService accountService, ILoginService loginService)
        {
            this.logger = logger;
            this.accountService = accountService;
            this.loginService = loginService;
        }

        [HttpGet]
        public IEnumerable<Account> GetAllAsync()
        {
            logger.LogInformation("Get all accounts, Controller");
            var accounts = accountService.GetAllAccounts().ToList();
            return accounts;
        }

        [HttpGet("email/{email}")]
        public async Task<Account> GetByEmail(string email)
        {
            logger.LogInformation($"Get account by email: {email}, Controller");
            var account = await accountService.GetByEmailAsync(email);
            return account;
        }

        [HttpGet("{username}")]
        public async Task<Account> GetAccount(string username)
        {
            logger.LogInformation($"Get account by username: {username}, Controller");
            return await accountService.GetByUsernameAsync(username);
        }

        [HttpPost("createAccount/{name}/{email}")]
        public async Task<IActionResult> CreateAccount(string name, string email, NewAccountRequest request)
        {
            logger.LogInformation($"Create account {name}, {email}, Controller");
            try
            {
                var account = await accountService.CreateAccountAsync(name, email, request.Username, request.Password, request.Permissions);
                return Created("account", account);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        public class NewAccountRequest
        {
            public string Username { get; set; } = String.Empty;
            public string Password { get; set; } = String.Empty;
            public List<AccountPermissions> Permissions { get; set; } = new List<AccountPermissions>();
        }

        [HttpPut("make_payment/{email}/{pmt}")]
        public async Task<IActionResult> MakePayment(string email, double pmt)
        {
            logger.LogInformation($"Make payment of {pmt} on {email}, Controller");
            try
            {
                return Ok(await accountService.MakePaymentAsync(email, pmt));
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            logger.LogInformation($"Login, Controller");
            try
            {
                var account = await loginService.LoginAsync(loginRequest.Email, loginRequest.Password);
                if (account.Name != "NullName"
                    && account.Username != "NullAccount"
                    && account.Email != "null@null.null"
                    && account.AccountId != Guid.Empty.ToString()
                    && account.LoginToken != Guid.Empty.ToString())
                {
                    account.TokenSalt = new byte[64];
                    account.PasswordSalt = new byte[64];
                    account.Password = Guid.Empty.ToString();
                    account.Permissions.ForEach(p => p.TokenSalt = new byte[64]);
                    return Ok(account);
                }
                else return BadRequest(account);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost("logout/{username}")]
        public async Task<IActionResult> Logout(string username)
        {
            logger.LogInformation("Logout, Controller");
            return Ok(await loginService.LogOutAsync(username));
        }
    }
}
