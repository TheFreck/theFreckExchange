using Machine.Specifications;
using Microsoft.AspNetCore.Identity.Data;
using Moq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Services;
using Payment_Processing.Server.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using It = Machine.Specifications.It;
using Microsoft.AspNetCore.Mvc;

namespace Payment_Processing.Specs
{
    public class With_Login_Setup
    {
        Establish context = () =>
        {
            loginServiceMock = new Mock<ILoginService>();
            accountRepoMock = new Mock<IAccountRepo>();
            account1Id = "account1Id";
            accountId = Guid.NewGuid().ToString();
            name = "name";
            username = "username1@username.com";
            password = "password";
            permissions = new List<AccountPermissions>
            {
                new AccountPermissions(PermissionType.Admin),
                new AccountPermissions(PermissionType.User)
            };
            account = new Account(name, username, password, username, permissions);
        };

        protected static Mock<ILoginService> loginServiceMock;
        protected static Mock<IAccountRepo> accountRepoMock;
        protected static string account1Id;
        protected static string accountId;
        protected static string name;
        protected static string username;
        protected static string password;
        private static List<AccountPermissions> permissions;
        protected static Account account;
    }
    public class When_Creating_New_Login : With_Login_Setup
    {
        Establish context = () =>
        { 
            accountRepoMock.Setup(r => r.GetByUsernameAsync(username)).ReturnsAsync(account);
            outSalt = Encoding.ASCII.GetBytes("GotOut");
            loginService = new LoginService(accountRepoMock.Object);
            password = "password";
        };

        Because of = () => outcome = loginService.CreateLogin(password);

        It Should_Return_Fresh_Hash = () => outcome.hash.ShouldNotBeNull();
        It Should_Return_Salt = () => outcome.salt.ShouldNotBeNull();

        private static string accountId;
        private static string name;
        private static string username;
        private static string password;
        private static Account account;
        private static ILoginService loginService;
        private static LoginRequest loginRequenst;
        private static (string hash, byte[] salt) outcome;
        private static byte[] outSalt;
        private static byte[] mockOut;
    }

    public class When_Verifying_A_Hash : With_Login_Setup
    {
        Establish context = () =>
        {
            loginService = new LoginService(accountRepoMock.Object);
            hash = loginService.MakeHash(password,out salt);
        };

        Because of = () => hashBack = loginService.VerifyHash(password, hash, salt);

        It Should_Return_The_Same_Hash = () => hashBack.ShouldBeTrue();

        private static string hash;
        private static bool hashBack;
        private static byte[] salt;
        private static ILoginService loginService;
    }

    public class When_Logging_Into_An_Account_With_Correct_Password : With_Login_Setup
    {
        Establish context = () =>
        {
            accountRepoMock.Setup(a => a.GetByUsernameAsync(username)).ReturnsAsync(account);
            loginService = new LoginService(accountRepoMock.Object);
            account.Password = loginService.MakeHash(password, out var salt);
            account.PasswordSalt = salt;
        };

        Because of = () => loggedInAccount = loginService.LoginAsync(username, password).GetAwaiter().GetResult();

        It Should_Return_Correct_Account = () =>
        {
            loggedInAccount.Name.ShouldEqual(account.Name);
            loggedInAccount.Username.ShouldEqual(account.Username);
            loggedInAccount.Email.ShouldEqual(account.Email);
        };

        It Should_Get_Account_From_Repo = () => accountRepoMock.Verify(a => a.GetByUsernameAsync(username), Times.Once());

        It Should_Add_A_Token_To_The_Account = () => loggedInAccount.Token.ShouldNotEqual(Guid.Empty.ToString());

        It Should_Persist_The_Account_With_Token = () => accountRepoMock.Verify(a => a.UpdateAsync(Moq.It.IsAny<Account>()), Times.Once());

        private static ILoginService loginService;
        private static Account loggedInAccount;
    }

    public class When_Logging_Into_An_Account_With_Incorrect_Password : With_Login_Setup
    {
        Establish context = () =>
        {
            accountRepoMock.Setup(a => a.GetByUsernameAsync(username)).ReturnsAsync(account);
            loginService = new LoginService(accountRepoMock.Object);
            account.Password = loginService.MakeHash(password, out var salt);
            account.PasswordSalt = salt;
        };

        Because of = () => loggedInAccount = loginService.LoginAsync(username, "parseword").GetAwaiter().GetResult();

        It Should_Return_Correct_Account = () =>
        {
            loggedInAccount.Username.ShouldEqual("NullAccount");
            loggedInAccount.Name.ShouldEqual("NullName");
            loggedInAccount.Email.ShouldEqual("null@null.null");
        };

        It Should_Get_Account_From_Repo = () => accountRepoMock.Verify(a => a.GetByUsernameAsync(username), Times.Once());

        It Should_Not_Add_A_Token_To_The_Account = () => loggedInAccount.Token.ShouldEqual(Guid.Empty.ToString());

        It Should_Not_Persist_The_Account_With_Token = () => accountRepoMock.VerifyNoOtherCalls();

        private static ILoginService loginService;
        private static Account loggedInAccount;
    }

    public class When_Logging_Out_Of_An_Account : With_Login_Setup
    {
        Establish context = () =>
        {
            accountRepoMock.Setup(a => a.GetByUsernameAsync(username)).ReturnsAsync(account);
            accountRepoMock.Setup(a => a.UpdateAsync(account));
            loginService = new LoginService(accountRepoMock.Object);
        };

        Because of = () => loggedOut = loginService.LogOutAsync(username).GetAwaiter().GetResult();

        It Should_Return_True = () => loggedOut.ShouldBeTrue();

        It Should_Get_Account_From_Repo = () => accountRepoMock.Verify(a => a.GetByUsernameAsync(username), Times.Once());

        It Should_Remove_Token_From_Account = () => account.Token.ShouldEqual(Guid.Empty.ToString());

        It Should_Remove_TokenSalt_From_Account = () => account.TokenSalt.ShouldEqual(new byte[64]);

        It Should_Update_AccountRepo_With_LoggedOut_Account = () => accountRepoMock.Verify(a => a.UpdateAsync(Moq.It.IsAny<Account>()), Times.Once());

        private static ILoginService loginService;
        private static bool loggedOut;
    }

    public class When_Validating_Admin_Permissions : With_Login_Setup
    {
        Establish context = () =>
        {
            accountRepoMock.Setup(a => a.GetByUsernameAsync(username)).ReturnsAsync(account);
            loginService = new LoginService(accountRepoMock.Object);
            account.Permissions.Where(p => p.Type == PermissionType.Admin).FirstOrDefault().Token = loginService.MakeHash(PermissionType.Admin.ToString(), out var salt);
            account.Permissions.Where(p => p.Type == PermissionType.Admin).FirstOrDefault().TokenSalt = salt;
        };

        Because of = () => isValid = loginService.ValidatePermissionsAsync(account,PermissionType.Admin).GetAwaiter().GetResult();

        It Should_Get_Account_From_Repo = () => accountRepoMock.Verify(r => r.GetByUsernameAsync(Moq.It.IsAny<string>()), Times.Once());

        It Should_Return_True = () => isValid.ShouldEqual(true);

        private static ILoginService loginService;
        private static string adminHash;
        private static bool isValid;
    }

    public class When_Validating_User_Permissions : With_Login_Setup
    {
        Establish context = () =>
        {
            accountRepoMock.Setup(a => a.GetByUsernameAsync(username)).ReturnsAsync(account);
            loginService = new LoginService(accountRepoMock.Object);
            account.Permissions.Where(p => p.Type == PermissionType.User).FirstOrDefault().Token = loginService.MakeHash(PermissionType.User.ToString(), out var salt);
            account.Permissions.Where(p => p.Type == PermissionType.User).FirstOrDefault().TokenSalt = salt;
        };

        Because of = () => isValid = loginService.ValidatePermissionsAsync(account, PermissionType.User).GetAwaiter().GetResult();

        It Should_Get_Account_From_Repo = () => accountRepoMock.Verify(r => r.GetByUsernameAsync(Moq.It.IsAny<string>()), Times.Once());

        It Should_Return_True = () => isValid.ShouldEqual(true);

        private static ILoginService loginService;
        private static bool isValid;
    }
}
