using Machine.Specifications;
using Microsoft.AspNetCore.Http;
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
            imageFiles = new List<ImageFile>
            {
                new ImageFile
                {
                    Image = Encoding.ASCII.GetBytes("these are the first image bytes"),
                    Name = "Image 1",
                    ImageId = Guid.NewGuid().ToString(),
                },
                new ImageFile
                {
                    Image = Encoding.ASCII.GetBytes("these are the second image bytes"),
                    Name = "Image 2",
                    ImageId = Guid.NewGuid().ToString(),
                }
            };
            background = new ImageFile
            {
                Image = Encoding.ASCII.GetBytes("background image"),
                Name = "Background",
                ImageId = Guid.NewGuid().ToString()
            };
            configDTO = new ConfigDTO
            {
                AdminAccountId = account.AccountId,
                SiteTitle = siteTitle,
                CategoryTitle = categoryTitle,
                Categories = categories,
                ImageFiles = imageFiles,
                Background = background,
            };
        };
        protected static Mock<IConfigRepo> configRepoMock;
        protected static Mock<IAccountRepo> accountRepoMock;
        protected static string name;
        protected static string username;
        protected static string password;
        protected static List<AccountPermissions> permissions;
        protected static Account account;
        protected static string siteTitle;
        protected static string categoryTitle;
        protected static List<Categories> categories;
        protected static List<ImageFile> imageFiles;
        protected static ImageFile background;
        protected static ConfigDTO configDTO;
    }

    public class When_Setting_Up_Site_Configuration : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.CreateNew(account.AccountId,siteTitle, categoryTitle, categories, imageFiles, background);

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
            for (var i = 0; i < configDTO.Categories.Count; i++) 
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for(var i=0; i<configDTO.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
            }
        };

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
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
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
            for (var i = 0; i < configOutcome.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
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
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(updatedAdminId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
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
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(updatedCategoryTitle);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
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
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(updatedCategories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(updatedCategories[i].Description);
            }
            for (var i = 0; i < configOutcome.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
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
            updatedImageFiles = new List<ImageFile>
            {
                new ImageFile
                {
                    Image = Encoding.ASCII.GetBytes("these are the first image bytes to be updated"),
                    Name = "Updated Image 1",
                    ImageId = Guid.NewGuid().ToString(),
                },
                new ImageFile
                {
                    Image = Encoding.ASCII.GetBytes("these are the second image bytes to be updated"),
                    Name = "Updated Image 2",
                    ImageId = Guid.NewGuid().ToString(),
                }
            };
            configTest = new ConfigDTO
            {
                ImageFiles = updatedImageFiles
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            configOutcome.ImageFiles.Count.ShouldEqual(configDTO.ImageFiles.Count);
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static IConfigService configService;
        private static List<ImageFile> updatedImageFiles;
        private static ConfigDTO configTest;
    }

    public class When_Updating_Background : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            updatedBackground = new ImageFile
            {
                Image = Encoding.ASCII.GetBytes("Updated background image"),
                Name = "Updated Background",
                ImageId = Guid.NewGuid().ToString()
            };
            configTest = new ConfigDTO
            {
                Background = updatedBackground,
            };
            configRepoMock.Setup(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()));
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.UpdateConfigAsync(configTest).GetAwaiter().GetResult();

        It Should_Form_A_ConfigDTO_And_Return_It = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.Background.Name.ShouldEqual(updatedBackground.Name);
            configOutcome.Background.ImageId.ShouldEqual(updatedBackground.ImageId);
            configOutcome.Background.Image.ShouldEqual(updatedBackground.Image);
            for (var i = 0; i < configOutcome.Categories.Count; i++)
            {
                configOutcome.Categories[i].Name.ShouldEqual(configDTO.Categories[i].Name);
                configOutcome.Categories[i].Description.ShouldEqual(configDTO.Categories[i].Description);
            }
            for (var i = 0; i < configOutcome.ImageFiles.Count; i++)
            {
                configOutcome.ImageFiles[i].Name.ShouldEqual(configDTO.ImageFiles[i].Name);
                configOutcome.ImageFiles[i].ImageId.ShouldEqual(configDTO.ImageFiles[i].ImageId);
                configOutcome.ImageFiles[i].Image.ShouldEqual(configDTO.ImageFiles[i].Image);
            }
        };

        It Should_Store_Config_In_The_Repo = () => configRepoMock.Verify(c => c.UploadNewAsync(Moq.It.IsAny<ConfigDTO>()), Times.Once);

        private static ConfigDTO configOutcome;
        private static ImageFile updatedBackground;
        private static ConfigDTO configTest;
        private static IConfigService configService;
    }

    public class When_Retrieving_Site_Config : With_ConfigRepo_Setup
    {
        Establish context = () =>
        {
            configRepoMock.Setup(c => c.GetConfigAsync()).ReturnsAsync(configDTO);
            configService = new ConfigService(configRepoMock.Object);
        };

        Because of = () => configOutcome = configService.GetConfigAsync().GetAwaiter().GetResult();

        It Should_Get_Config_From_Repo = () => configRepoMock.Verify(c => c.GetConfigAsync(), Times.Once);

        It Should_Return_Config = () =>
        {
            configOutcome.AdminAccountId.ShouldEqual(configDTO.AdminAccountId);
            configOutcome.ConfigId.ShouldEqual(configDTO.ConfigId);
            configOutcome.CategoryTitle.ShouldEqual(configDTO.CategoryTitle);
            configOutcome.SiteTitle.ShouldEqual(configDTO.SiteTitle);
            configOutcome.Categories.Count.ShouldEqual(configDTO.Categories.Count);
            configOutcome.ImageFiles.Count.ShouldEqual(configDTO.ImageFiles.Count);
            configOutcome.Background.Name.ShouldEqual(configDTO.Background.Name);
            configOutcome.Background.ImageId.ShouldEqual(configDTO.Background.ImageId);
            configOutcome.Background.Image.ShouldEqual(configDTO.Background.Image);
        };

        private static IConfigService configService;
        private static ConfigDTO configOutcome;
    }
}
