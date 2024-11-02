using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Services;

namespace Payment_Processing.Server.Controllers
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
        public async Task<IEnumerable<Account>> GetAllAsync()
        {
            var accounts = (await accountService.GetAllAccountsAsync()).ToList();
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

                throw;
            }
        }

        public class NewAccountRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public List<AccountPermissions> Permissions { get; set; }
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
            var account = await loginService.LoginAsync(loginRequest.Email, loginRequest.Password);
            if(account.Name != "NullName" 
                && account.Username != "NullAccount" 
                && account.Email != "null@null.null" 
                && account.AccountId != Guid.Empty.ToString()
                && account.Token != Guid.Empty.ToString())
            {
                return Ok(account);
            }
            else return BadRequest(account);
        }

        [HttpPost("logout/{username}")]
        public async Task<IActionResult> Logout(string username)
        {
            return Ok(await loginService.LogOutAsync(username));
        }
    }
}
