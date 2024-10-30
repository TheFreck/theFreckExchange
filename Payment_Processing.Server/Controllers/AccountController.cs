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

        public AccountController(ILogger<AccountController> logger, IAccountService accountService)
        {
            _logger = logger;
            this.accountService = accountService;
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

        [HttpGet("{accountId}")]
        public async Task<Account> GetAccount(string accountId)
        {
            return await accountService.GetByAccountIdAsync(accountId);
        }

        [HttpPost("createAccount/{name}/{email}/{balance}")]
        public async Task<IActionResult> CreateAccount(string name, string email, double balance)
        {
            try
            {
                var account = await accountService.CreateAccountAsync(name, email,balance);
                return Created("account",account);
            }
            catch (Exception)
            {

                throw;
            }
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
    }
}
