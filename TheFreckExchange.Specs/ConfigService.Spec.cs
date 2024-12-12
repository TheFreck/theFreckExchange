using Machine.Specifications;
using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;
using TheFreckExchange.Server.Services;
using It = Machine.Specifications.It;

namespace TheFreckExchange.Specs
{
    public class With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock = new Mock<IConfigRepo>();
            accountRepoMock = new Mock<IAccountRepo>();
            productRepoMock = new Mock<IProductRepo>();
            name = "name";
            username = "username1@username.com";
            password = "password";
            permissions = new List<AccountPermissions>
            {
                new AccountPermissions(PermissionType.Admin),
                new AccountPermissions(PermissionType.User)
            };
            account = new Account(name, username, username, permissions);

            siteTitle = "Title Test";
            categoryTitle = "Category Title Test";
            categories = new List<Categories>
            {
                new Categories
                {
                    Name = "Type 1",
                    Description = "Type 1 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Type 2",
                    Description = "Type 2 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Type 3",
                    Description = "Type 3 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Type 4",
                    Description = "Type 4 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Type 5",
                    Description = "Type 5 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Type 6",
                    Description = "Type 6 is a category of nothing in particular"
                }
            };
            imageRefs = new List<string>
            {
                Guid.NewGuid().ToString(),
                Guid.NewGuid().ToString()
            };
            background = Guid.NewGuid().ToString();
            configDTO = new ConfigDTO
            {
                AdminAccountId = account.AccountId,
                SiteTitle = siteTitle,
                CategoryTitle = categoryTitle,
                Categories = categories,
                Images = imageRefs,
                Background = background,
                ConfigId = Guid.NewGuid().ToString()
            };
        };
        protected static Mock<IConfigRepo> configRepoMock;
        protected static Mock<IAccountRepo> accountRepoMock;
        protected static Mock<IProductRepo> productRepoMock;
        protected static string name;
        protected static string username;
        protected static string password;
        protected static List<AccountPermissions> permissions;
        protected static Account account;
        protected static string siteTitle;
        protected static string categoryTitle;
        protected static List<Categories> categories;
        protected static List<string> imageRefs;
        protected static string background;
        protected static ConfigDTO configDTO;
    }

    public class When_Setting_Up_Site_Configuration : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            accountRepoMock.Setup(a => a.GetByAccountIdAsync(Moq.It.IsAny<string>())).ReturnsAsync(account);
            configService = new ConfigService(configRepoMock.Object,accountRepoMock.Object,productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.CreateNewAsync(configDTO).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configDTO.Categories.Count; i++) 
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for(var i=0; i<configDTO.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Get_Admin_Account_From_Repo = () => accountRepoMock.Verify(a => a.GetByAccountIdAsync(Moq.It.IsAny<string>()), Times.Once);

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static IConfigService configService;
    }

    public class When_Updating_Site_Title : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedTitle = "Updated Title Test";
            configTest = new ConfigDTO
            {
                SiteTitle = updatedTitle
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(updatedTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static string updatedTitle;
        private static ConfigDTO configTest;
        private static IConfigService configService;
    }

    public class When_Updating_AdminId : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedAdminId = Guid.NewGuid().ToString();
            configTest = new ConfigDTO
            {
                AdminAccountId = updatedAdminId
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(updatedAdminId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static IConfigService configService;
        private static string updatedAdminId;
        private static ConfigDTO configTest;
    }

    public class When_Updating_Category_Title : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedCategoryTitle = "Updated Category Title Test";
            configTest = new ConfigDTO
            {
                CategoryTitle = updatedCategoryTitle,
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(updatedCategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static string updatedCategoryTitle;
        private static ConfigDTO configTest;
        private static IConfigService configService;
    }

    public class When_Updating_Categories : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedCategories = new List<Categories>
            {
                new Categories
                {
                    Name = "Updated Type 1",
                    Description = "Updated Type 1 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Updated Type 2",
                    Description = "Updated Type 2 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Updated Type 3",
                    Description = "Updated Type 3 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Updated Type 4",
                    Description = "Updated Type 4 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Updated Type 5",
                    Description = "Updated Type 5 is a category of nothing in particular"
                },
                new Categories
                {
                    Name = "Updated Type 6",
                    Description = "Updated Type 6 is a category of nothing in particular"
                }
            };
            configTest = new ConfigDTO
            {
                Categories = updatedCategories
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(updatedCategories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(updatedCategories[i].Description);
            }
            for (var i = 0; i < configOutcome.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static List<Categories> updatedCategories;
        private static ConfigDTO configTest;
        private static IConfigService configService;
    }

    public class When_Updating_ImageFiles : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedImageFiles = new List<string>
            {
                Guid.NewGuid().ToString(),
                Guid.NewGuid().ToString()
            };
            configTest = new ConfigDTO
            {
                Images = updatedImageFiles
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(configDTO.Background);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            configOutcome.Images.Count.ShouldEqual(configDTO.Images.Count);
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static IConfigService configService;
        private static List<string> updatedImageFiles;
        private static ConfigDTO configTest;
    }

    public class When_Updating_Background : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedBackground = Guid.NewGuid().ToString();
            configTest = new ConfigDTO
            {
                Background = updatedBackground,
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.ShouldEqual(updatedBackground);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.Images.Count; i++)
            {
                configOutcome.Images[i].ShouldEqual(configDTO.Images[i]);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static string updatedBackground;
        private static ConfigDTO configTest;
        private static IConfigService configService;
    }

    public class When_Retrieving_Site_Config : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => configOutcome = configService.GetConfigAsync(configDTO.ConfigId).GetAwaiter().GetResult();

        It Should_Get_Config_From_Repo = () => configRepoMock.Verify(c => c.GetConfigAsync(Moq.It.IsAny<string>()), Times.Once);

        It Should_Return_Config = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.ConfigId.ShouldEqual(configDTO.ConfigId);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.Categories.Count.ShouldEqual(configDTO.Categories.Count);
            configOutcome.Images.Count.ShouldEqual(configDTO.Images.Count);
            configOutcome.Background.ShouldEqual(configDTO.Background);
        };

        private static IConfigService configService;
        private static ConfigDTO configOutcome;
    }

    public class When_Deleting_Current_Site_Config : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock.Setup(c => c.GetConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configRepoMock.Setup(c => c.DeleteConfigAsync(Moq.It.IsAny<string>())).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object, accountRepoMock.Object, productRepoMock.Object);
        };

        Because of = () => deleteOutcome = configService.DeleteConfigAsync(configDTO.ConfigId).GetAwaiter().GetResult();

        It Should_Find_Config_In_Repo = () => configRepoMock.Verify(c => c.GetConfigAsync(Moq.It.IsAny<string>()), Times.Once);

        It Should_Return_Deleted_Config = () =>
        {
            deleteOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            deleteOutcome.ConfigId.ShouldEqual(configDTO.ConfigId);
            deleteOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
        };

        It Should_Remove_Config_From_Repo = () => configRepoMock.Verify(c => c.DeleteConfigAsync(Moq.It.IsAny<string>()),Times.Once);

        private static IConfigService configService;
        private static ConfigDTO deleteOutcome;
    }
}
