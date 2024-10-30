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
            account1Id = Guid.NewGuid().ToString();
            account2Id = Guid.NewGuid().ToString();
            email1 = "carl@email.com";
            email2 = "jane@email.com";
        };

        protected static Mock<IAccountRepo> accountRepoMock;
        protected static string account1Id;
        protected static string account2Id;
        protected static string email1;
        protected static string email2;
    }

    public class When_Creating_A_New_Account : With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            service = new AccountService(accountRepoMock.Object);
            inputs = new List<(string name, string email, double balance)>
            {
                new ("Carl","carl@email.com", 35),
                new ("Jane", "jane@email.com", 90)
            };
            expectations = new List<Account>
            {
                new Account
                {
                    AccountId = "",
                    Name="Carl",
                    Email = "carl@email.com",
                    Balance = 35,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId = "",
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = 90,
                    DateOpened = DateTime.Now,
                }
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.CreateAccountAsync(inputs[i].name, inputs[i].email, inputs[i].balance).GetAwaiter().GetResult());
            }
        };

        It Should_Return_Fully_Formed_Accounts = () =>
        {
            for(var i=0; i<expectations.Count; i++)
            {
                outcomes[i].AccountId.ShouldNotEqual(string.Empty);
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
                accountRepoMock.Verify(a => a.CreateAsync(Moq.It.IsAny<Account>()),Times.Exactly(inputs.Count));
            }
        };

        private static AccountService service;
        private static List<(string name, string email, double balance)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
    }

    public class When_Getting_Account_With_AccountId : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object);
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account1Id)).ReturnsAsync(
                new Account
                {
                    AccountId = account1Id,
                    Name = "Carl",
                    Email = "carl@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account2Id)).ReturnsAsync(
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = "jane@email.com",
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            inputs = new List<string>
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
                outcomes.Add(service.GetByAccountIdAsync(inputs[i]).GetAwaiter().GetResult());
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
                accountRepoMock.Verify(a => a.GetByAccountIdAsync(Moq.It.IsAny<string>()),Times.Exactly(inputs.Count));
            }
        };

        private static List<string> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
    }

    public class When_Getting_Account_With_Email : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object);
            accountRepoMock.Setup(a => a.GetByEmailAsync(email1)).ReturnsAsync(
                new Account
                {
                    AccountId = account1Id,
                    Name = "Carl",
                    Email = email1,
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            accountRepoMock.Setup(a => a.GetByEmailAsync(email2)).ReturnsAsync(
                new Account
                {
                    AccountId = account2Id,
                    Name = "Jane",
                    Email = email2,
                    Balance = 0,
                    DateOpened = DateTime.Now,
                });
            inputs = new List<string>
            {
                email1,email2
            };
            expectations = new List<Account>
            {
                new Account
                {
                    AccountId = account1Id,
                    Name="Carl",
                    Email = email1,
                    Balance = 0,
                    DateOpened = DateTime.Now,
                },
                new Account
                {
                    AccountId= account2Id,
                    Name = "Jane",
                    Email = email2,
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
                outcomes.Add(service.GetByEmailAsync(inputs[i]).GetAwaiter().GetResult());
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
                accountRepoMock.Verify(a => a.GetByEmailAsync(inputs[i]), Times.Once);
            }
        };

        private static List<string> inputs;
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
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account1Id)).ReturnsAsync(accounts[0]);
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account2Id)).ReturnsAsync(accounts[1]);
            inputs = new List<(string acctId, double balanceIncrease)>
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
                accountRepoMock.Verify(r => r.GetByAccountIdAsync(accounts[i].AccountId), Times.Once);
            }
        };

        It Should_Persist_Updated_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.UpdateAsync(accounts[i]), Times.Once);
            }
        };

        private static List<(string acctId, double balanceIncrease)> inputs;
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
            accountRepoMock.Setup(a => a.GetByEmailAsync(email1)).ReturnsAsync(accounts[0]);
            accountRepoMock.Setup(a => a.GetByEmailAsync(email2)).ReturnsAsync(accounts[1]);
            inputs = new List<(string acctId, double payment)>
            {
                new (email1,50),
                new (email2,75)
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
                outcomes.Add(service.MakePaymentAsync(inputs[i].email, inputs[i].payment).GetAwaiter().GetResult());
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
                accountRepoMock.Verify(a => a.GetByEmailAsync(inputs[i].email), Times.Once());
            }
        };

        It Should_Persist_Updated_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.UpdateAsync(Moq.It.IsAny<Account>()), Times.Exactly(expectations.Count));
            }
        };

        private static List<(string email, double payment)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
        private static int acct1StartingBalance;
        private static int acct2StartingBalance;
        private static double[] startingBalances;
        private static List<Account> accounts;
    }
}