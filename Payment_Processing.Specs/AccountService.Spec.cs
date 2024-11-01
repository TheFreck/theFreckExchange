using Machine.Specifications;
using Moq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using Payment_Processing.Server.Services;
using System.Runtime;
using It = Machine.Specifications.It;

namespace Payment_Processing.Specs
{
    public class With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            accountRepoMock = new Mock<IAccountRepo>();
            loginServiceMock = new Mock<ILoginService>();
            account1Id = Guid.NewGuid().ToString();
            account2Id = Guid.NewGuid().ToString();
            name1 = "Carl";
            name2 = "Jane";
            email1 = "carl@email.com";
            email2 = "jane@email.com";
            username1 = "theCarl";
            username2 = "theJane";
            password1 = "password1";
            password2 = "password2";
            permissions1 = new List<AccountPermissions>
            {
                new AccountPermissions
                {
                    Type = PermissionType.Admin,
                },
                new AccountPermissions
                {
                    Type= PermissionType.User,
                }
            };
            permissions2 = new List<AccountPermissions>
            {
                new AccountPermissions
                {
                    Type = PermissionType.User,
                }
            };
            permissions = new List<List<AccountPermissions>>
            {
                permissions1,permissions2
            };
            account1 = new Account(name1, email1, password1, email1, permissions1);
            account2 = new Account(name2, email2, password2, email2, permissions2);
        };

        protected static Mock<IAccountRepo> accountRepoMock;
        protected static Mock<ILoginService> loginServiceMock;
        protected static string account1Id;
        protected static string account2Id;
        protected static string name1;
        protected static string name2;
        protected static string email1;
        protected static string email2;
        protected static string username1;
        protected static string username2;
        protected static string password1;
        protected static string password2;
        protected static List<AccountPermissions> permissions1;
        protected static List<AccountPermissions> permissions2;
        protected static List<List<AccountPermissions>> permissions;
        protected static Account account1;
        protected static Account account2;
    }

    public class When_Creating_A_New_Account : With_AcctRepo_Setup
    {
        Establish context = () =>
        {
            loginServiceMock.Setup(l => l.CreateLogin(Moq.It.IsAny<string>())).Returns((string.Empty, new byte[64]));
            service = new AccountService(accountRepoMock.Object,loginServiceMock.Object);
            inputs = new List<(string name, string email, string username, string password, double balance)>
            {
                new (name1, email1, username1, password1, 35),
                new (name2, email2, username2, password2, 90)
            };
            expectations = new List<Account>
            {
                account1,account2
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.CreateAccountAsync(inputs[i].name, inputs[i].email, inputs[i].username, inputs[i].password, permissions[i]).GetAwaiter().GetResult());
            }
        };

        It Should_Get_Login_From_Login_Service = () => loginServiceMock.Verify(l => l.CreateLogin(Moq.It.IsAny<string>()), Times.Exactly(inputs.Count));

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

        It Should_Assign_Permissions_To_Account = () =>
        {
            for(var i=0; i<expectations.Count ; i++)
            {
                var types = outcomes[i].Permissions.Select(p => p.Type).ToList();
                types.ShouldContainOnly(outcomes[i].Permissions.Select(i => i.Type));
            }
        };

        It Should_Strip_Permissions_Of_TokenSalt = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Permissions.ForEach(p =>
                {
                    p.TokenSalt.ShouldEqual(new byte[64]);
                });
            }
        };

        It Should_Strip_Account_Of_Credentials_Before_Returning = () =>
        {
            for(var i=0; i < expectations.Count; i++)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
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
        private static List<(string name, string email, string username, string password, double balance)> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
    }

    public class When_Getting_All_Accounts : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
            accountRepoMock.Setup(a => a.GetAllAccountsAsync()).ReturnsAsync(new List<Account> { account1,account2});
            inputs = new List<string>
            {
                account1Id,account2Id
            };
            expectations = new List<Account>
            {
                account1,account2
            };
            outcomes = new List<Account>();
        };

        Because of = () => outcomes = service.GetAllAccountsAsync().GetAwaiter().GetResult().ToList();

        It Should_Return_All_Accounts = () => outcomes.Count.ShouldEqual(expectations.Count);

        It Should_Strip_Accounts_Of_Credentials = () =>
        {
            for (var i = 0; i < outcomes.Count; i++) 
            {
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
            }
        };

        private static AccountService service;
        private static List<string> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
    }

    public class When_Getting_Account_With_AccountId : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account1Id)).ReturnsAsync(account1);
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(account2Id)).ReturnsAsync(account2);
            inputs = new List<string>
            {
                account1Id,account2Id
            };
            expectations = new List<Account>
            {
                account1,account2
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

        It Should_Strip_Credentials_From_Account_Before_Returning = () =>
        {
            for(var i = 0;i < expectations.Count; i++)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
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
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
            accountRepoMock.Setup(a => a.GetByEmailAsync(email1)).ReturnsAsync(account1);
            accountRepoMock.Setup(a => a.GetByEmailAsync(email2)).ReturnsAsync(account2);
            inputs = new List<string>
            {
                email1,email2
            };
            expectations = new List<Account>
            {
                account1,account2
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

        It Should_Strip_Credentials_From_Account_Before_Returning = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
            }
        };

        private static List<string> inputs;
        private static List<Account> expectations;
        private static List<Account> outcomes;
        private static AccountService service;
    }

    public class When_Getting_Account_With_Username : With_AcctRepo_Setup
    {
        Establish context = static () =>
        {
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
            accountRepoMock.Setup(a => a.GetByUsernameAsync(email1)).ReturnsAsync(account1);
            accountRepoMock.Setup(a => a.GetByUsernameAsync(email2)).ReturnsAsync(account2);
            inputs = new List<string>
            {
                email1,email2
            };
            expectations = new List<Account>
            {
                account1,account2
            };
            outcomes = new List<Account>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.GetByUsernameAsync(inputs[i]).GetAwaiter().GetResult());
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
                accountRepoMock.Verify(a => a.GetByUsernameAsync(inputs[i]), Times.Once);
            }
        };

        It Should_Strip_Credentials_From_Account_Before_Returning = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
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
            acct1StartingBalance = 100;
            acct2StartingBalance = 230;
            startingBalances = new double[]
            {
                acct1StartingBalance,acct2StartingBalance
            };
            account1.Balance = acct1StartingBalance;
            account2.Balance = acct2StartingBalance;
            accounts = new List<Account>
            {
                account1,account2
            };
            accountRepoMock.Setup(a => a.GetByUsernameAsync(account1.Username)).ReturnsAsync(account1);
            accountRepoMock.Setup(a => a.GetByUsernameAsync(account2.Username)).ReturnsAsync(account2);
            inputs = new List<(string username, double balanceIncrease)>
            {
                new (account1.Username,100),
                new (account2.Username,500)
            };
            expectations = new List<Account>
            {
                account1,account2
            };
            outcomes = new List<Account>();
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(service.AddToBalanceAsync(inputs[i].username, "token", inputs[i].balanceIncrease).GetAwaiter().GetResult());
            }
        };

        It Should_Return_The_Account_With_The_New_Balance = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Balance.ShouldEqual(inputs[i].balanceIncrease + startingBalances[i]);
            }
        };

        It Should_Get_The_Account_From_The_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(r => r.GetByUsernameAsync(Moq.It.IsAny<string>()), Times.Exactly(expectations.Count));
            }
        };

        It Should_Strip_Account_Of_Credentials = () =>
        {
            for(var i=0; i < expectations.Count; ++i)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
            }
        };

        It Should_Persist_Updated_Account = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                accountRepoMock.Verify(a => a.UpdateAsync(Moq.It.IsAny<Account>()), Times.Exactly(expectations.Count));
            }
        };

        private static List<(string username, double balanceIncrease)> inputs;
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
            service = new AccountService(accountRepoMock.Object, loginServiceMock.Object);
            acct1StartingBalance = 100;
            acct2StartingBalance = 230;
            startingBalances = new double[]
            {
                acct1StartingBalance,acct2StartingBalance
            };
            accounts = new List<Account>
            {
                account1,account2
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
                account1,account2
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

        It Should_Strip_Account_Of_Credentials = () =>
        {
            for (var i = 0; i < expectations.Count; ++i)
            {
                outcomes[i].Username.ShouldEqual(string.Empty);
                outcomes[i].Password.ShouldEqual(string.Empty);
                outcomes[i].Token.ShouldEqual(string.Empty);
                outcomes[i].PasswordSalt.ShouldEqual(new byte[64]);
                outcomes[i].TokenSalt.ShouldEqual(new byte[64]);
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