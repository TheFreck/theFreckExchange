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

        [HttpGet("/{accountId}")]
        public async Task<Account> GetAccount(string accountId)
        {
            return await accountService.GetAccountAsync(accountId);
        }

        [HttpPost("/createAccount/{name}/{email}")]
        public async Task<IActionResult> CreateAccount(string name, string email)
        {
            try
            {
                var account = await accountService.CreateAccountAsync(name, email);
                return Created("account",account);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPut("/make_payment/{accountId}/{pmt}")]
        public async Task<IActionResult> MakePayment(string accountId, double pmt)
        {
            try
            {
                return Ok(await accountService.MakePaymentAsync(accountId, pmt));
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
