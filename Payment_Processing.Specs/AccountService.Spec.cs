using Machine.Specifications;
using Moq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using Payment_Processing.Server.Services;
using It = Machine.Specifications.It;

namespace Payment_Processing.Specs
{
    public class With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            accountRepoMock = new Mock<IAccountRepo>();
            account1Id = Guid.NewGuid();
            account2Id = Guid.NewGuid();
        };

        protected static Mock<IAccountRepo> accountRepoMock;
        protected static Guid account1Id;
        protected static Guid account2Id;
    }

    public class When_Creating_A_New_Account : With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            service = new AccountService(accountRepoMock.Object);
            inputs = new List<(string name, string email)>
            {
                new ("Carl","carl@email.com"),
                new ("Jane", "jane@email.com")
            };
            expectations = new List<Account>
            {
                new Account
                {
                    Name="Carl",
                    Email = "carl@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                }
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.CreateAccount(inputs[i].name, inputs[i].email));
            }
        };

        It Should_Return_Fully_Formed_Accounts = () =>
        {
            for(var i=0; i<expectations.Count; i++)
            {
                outcomes[i].AccountId.ShouldNotEqual(Guid.Empty);
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].Email.ShouldEqual(expectations[i].Email);
                outcomes[i].Balance.ShouldEqual(expectations[i].Balance);
                outcomes[i].DateOpened.ShouldNotBeNull();
            }
        };

        It Should_Persist_New_Account = () =>
        {
            for(var i=0;i<expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.CreateOrUpdate(Moq.It.IsAny<Account>()),Times.Exactly(inputs.Count));
            }
        };

        private static AccountService service;
        private static List<(string name, string email)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
    }

    public class When_Getting_Account : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object);
            accountRepoMock.Setup(a => a.GetAccountAsync(account1Id)).ReturnsAsync(
                new Account
                {
                    AccountId = account1Id,
                    Name = "Carl",
                    Email = "carl@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            accountRepoMock.Setup(a => a.GetAccountAsync(account2Id)).ReturnsAsync(
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            inputs = new List<Guid>
            {
                account1Id,account2Id
            };
            expectations = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name="Carl",
                    Email = "carl@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId= account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                }
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.GetAccountAsync(inputs[i]).GetAwaiter().GetResult());
            }
        };

        It Should_Return_Correct_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].AccountId.ShouldEqual(expectations[i].AccountId);
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].Email.ShouldEqual(expectations[i].Email);
                outcomes[i].Balance.ShouldEqual(expectations[i].Balance);
                outcomes[i].DateOpened.ShouldNotBeNull();
            }
        };

        It Should_Call_Account_Repo_To_Get_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.GetAccountAsync(Moq.It.IsAny<Guid>()),Times.Exactly(inputs.Count));
            }
        };

        private static List<Guid> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
    }

    public class When_Adding_To_Account_Balance : With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            service = new AccountService(accountRepoMock.Object);
            acct1StartingBalance = 100;
            acct2StartingBalance = 230;
            startingBalances = new double[]
            {
                acct1StartingBalance,acct2StartingBalance
            };
            accounts = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name = "Carl",
                    Email = "carl@email.com",
                    Balance = startingBalances[0],
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = startingBalances[1],
                    DateOpened = DateTime.Now,
                }
            };
            accountRepoMock.Setup(a => a.GetAccountAsync(account1Id)).ReturnsAsync(accounts[0]);
            accountRepoMock.Setup(a => a.GetAccountAsync(account2Id)).ReturnsAsync(accounts[1]);
            inputs = new List<(Guid acctId, double balanceIncrease)>
            {
                new (account1Id,100),
                new (account2Id,500)
            };
            expectations = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name="Carl",
                    Email = "carl@email.com",
                    Balance = startingBalances[0] + 100,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = startingBalances[1] + 500,
                    DateOpened = DateTime.Now,
                }
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.AddToBalanceAsync(inputs[i].acctId, inputs[i].balanceIncrease).GetAwaiter().GetResult());
            }
        };

        It Should_Return_The_Account_With_The_New_Balance = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].AccountId.ShouldEqual(inputs[i].acctId);
                outcomes[i].Balance.ShouldEqual(inputs[i].balanceIncrease + startingBalances[i]);
            }
        };

        It Should_Get_The_Account_From_The_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(r => r.GetAccountAsync(accounts[i].AccountId), Times.Once);
            }
        };

        It Should_Persist_Updated_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.CreateOrUpdate(accounts[i]), Times.Once);
            }
        };

        private static List<(Guid acctId, double balanceIncrease)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
        private static int acct1StartingBalance;
        private static int acct2StartingBalance;
        private static double[] startingBalances;
        private static List<Account> accounts;
    }

    public class When_Paying_An_Account_In_Part : With_AcctRepo_Setup
    {

        Establish context = () =>
        {
            service = new AccountService(accountRepoMock.Object);
            acct1StartingBalance = 100;
            acct2StartingBalance = 230;
            startingBalances = new double[]
            {
                acct1StartingBalance,acct2StartingBalance
            };
            accounts = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name = "Carl",
                    Email = "carl@email.com",
                    Balance = startingBalances[0],
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = startingBalances[1],
                    DateOpened = DateTime.Now,
                }
            };
            accountRepoMock.Setup(a => a.GetAccountAsync(account1Id)).ReturnsAsync(accounts[0]);
            accountRepoMock.Setup(a => a.GetAccountAsync(account2Id)).ReturnsAsync(accounts[1]);
            inputs = new List<(Guid acctId, double payment)>
            {
                new (account1Id,50),
                new (account2Id,75)
            };
            expectations = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name="Carl",
                    Email = "carl@email.com",
                    Balance = startingBalances[0] - 50,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = startingBalances[1] - 75,
                    DateOpened = DateTime.Now,
                }
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.MakePaymentAsync(inputs[i].accountId, inputs[i].payment).GetAwaiter().GetResult());
            }
        };

        It Should_Reduce_Balance_By_Payment_Ammount = () =>
        {
            for(var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].AccountId.ShouldEqual(expectations[i].AccountId);
                outcomes[i].Balance.ShouldEqual(expectations[i].Balance);
            }
        };

        It Should_Get_Account_From_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.GetAccountAsync(inputs[i].accountId), Times.Once());
            }
        };

        It Should_Persist_Updated_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.CreateOrUpdate(Moq.It.IsAny<Account>()), Times.Exactly(expectations.Count));
            }
        };

        private static List<(Guid accountId, double payment)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
        private static int acct1StartingBalance;
        private static int acct2StartingBalance;
        private static double[] startingBalances;
        private static List<Account> accounts;
    }
}