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
        private readonly ILogger<AccountController> _logger;
        private readonly IAccountService accountService;
        private readonly ILoginService loginService;

        public AccountController(ILogger<AccountController> logger, IAccountService accountService, ILoginService loginService)
        {
            _logger = logger;
            this.accountService = accountService;
            this.loginService = loginService;
        }

        [HttpGet]
        public IEnumerable<Account> GetAllAsync()
        {
            var accounts = accountService.GetAllAccounts().ToList();
            return accounts;
        }

        [HttpGet("email/{email}")]
        public async Task<Account> GetByEmail(string email)
        {
            var account = await accountService.GetByEmailAsync(email);
            return account;
        }

        [HttpGet("{username}")]
        public async Task<Account> GetAccount(string username)
        {
            return await accountService.GetByUsernameAsync(username);
        }

        [HttpPost("createAccount/{name}/{email}")]
        public async Task<IActionResult> CreateAccount(string name, string email, NewAccountRequest request)
        {
            try
            {
                var account = await accountService.CreateAccountAsync(name, email,request.Username,request.Password, request.Permissions);
                return Created("account",account);
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
            try
            {
                var account = await loginService.LoginAsync(loginRequest.Email, loginRequest.Password);
                if(account.Name != "NullName" 
                    && account.Username != "NullAccount" 
                    && account.Email != "null@null.null" 
                    && account.AccountId != Guid.Empty.ToString()
                    && account.LoginToken != Guid.Empty.ToString())
                {
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
            return Ok(await loginService.LogOutAsync(username));
        }
    }
}
