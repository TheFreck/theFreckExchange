using Machine.Specifications;
using Microsoft.AspNetCore.Http;
using Moq;
using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using Payment_Processing.Server.Services;
using System.IO;
using System.Text;
using static System.Net.Mime.MediaTypeNames;
using It = Machine.Specifications.It;

namespace Payment_Processing.Specs
{
    public class With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            productRepoMock = new Mock<IProductRepo>();
            itemRepoMock = new Mock<IItemRepo>();
            accountRepoMock = new Mock<IAccountRepo>();
            imageRepoMock = new Mock<IImageRepo>();
            loginServiceMock = new Mock<ILoginService>();
            loginService = new LoginService(accountRepoMock.Object);
            account1Id = Guid.NewGuid().ToString();
            account2Id = Guid.NewGuid().ToString();
            name1 = "Carl";
            name2 = "Jane";
            email1 = "carl@email.com";
            email2 = "jane@email.com";
            password1 = "password1";
            password2 = "password2";
            permission1a = new AccountPermissions(PermissionType.Admin);
            permission1a.Token = loginService.MakeHash(PermissionType.Admin.ToString(), out var adminSalt);
            permission1a.TokenSalt = adminSalt;
            permission1b = new AccountPermissions(PermissionType.User);
            permission1b.Token = loginService.MakeHash(PermissionType.User.ToString(), out var userSalt);
            permission1b.TokenSalt = userSalt;
            permission1 = new List<AccountPermissions>
            {
                permission1a,
                permission1b
            };
            permission2a = new AccountPermissions(PermissionType.User);
            permission2a.Token = loginService.MakeHash(PermissionType.User.ToString(), out var user2Salt);
            permission2a.TokenSalt = user2Salt;
            permission2 = new List<AccountPermissions>
            {
                permission2a
            };
            account1 = new Account(name1, email1, password1, email1, permission1);
            account2 = new Account(name2, email2, password2, email2, permission2);
            account1.LoginToken = "token1";
            account2.LoginToken = "token2";
            product1Id = Guid.NewGuid().ToString();
            product2Id = Guid.NewGuid().ToString();
            product1Name = "hat";
            product2Name = "shirt";
            product1Desc = "it is worn on your head";
            product2Desc = "it is worn on your torso";
            product1Price = 25.75;
            product2Price = 74.99;
            product1AvailableAttributes = new List<string>
            {
                "Color","Size","Style"
            };
            product2AvailableAttributes = new List<string>
            {
                "Color","Style","Age"
            };
            loginCreds = new LoginCredentials
            {
                Username = account1.Username,
                AdminToken = permission1a.Token,
                UserToken = permission1b.Token,
                LoginToken = "LoginToken"
            };
        };


        protected static Mock<IProductRepo> productRepoMock;
        protected static Mock<IItemRepo> itemRepoMock;
        protected static Mock<IAccountRepo> accountRepoMock;
        protected static Mock<IImageRepo> imageRepoMock;
        protected static Mock<ILoginService> loginServiceMock;
        protected static ILoginService loginService;
        protected static string account1Id;
        protected static string account2Id;
        protected static string name1;
        protected static string name2;
        protected static string email1;
        protected static string email2;
        protected static string password1;
        protected static string password2;
        protected static AccountPermissions permission1a;
        protected static AccountPermissions permission1b;
        protected static List<AccountPermissions> permission1;
        protected static AccountPermissions permission2a;
        protected static List<AccountPermissions> permission2;
        protected static Account account1;
        protected static Account account2;
        protected static string product1Id;
        protected static string product2Id;
        protected static string product1Name;
        protected static string product2Name;
        protected static string product1Desc;
        protected static string product2Desc;
        protected static double product1Price;
        protected static double product2Price;
        protected static List<string> product1AvailableAttributes;
        protected static List<string> product2AvailableAttributes;
        protected static LoginCredentials loginCreds;
    }

    public class When_Creating_A_New_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            stream1 = new MemoryStream(Encoding.ASCII.GetBytes("these are the first image bytes"));
            stream2 = new MemoryStream(Encoding.ASCII.GetBytes("these are the second image bytes"));
            
            images = new List<IFormFile>
            {
                new FormFile(stream1,0,stream1.Length,"hatImage1","hatImageName1"),
                new FormFile(stream2,0,stream2.Length,"hatImage2","hatImageName2")
            };
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), PermissionType.Admin, Moq.It.IsAny<string>())).ReturnsAsync(true);
            inputs = new List<(string name, string id, string desccription, double price)>
            {
                new (product1Name,product1Id,product1Desc,product1Price),
                new (product2Name,product2Id,product2Desc,product2Price)
            };
            storeFront = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            attributes = new List<string>
            {
                "Color","Size","Style"
            };
            expectations = new List<Product>
            {
                new Product()
                {
                    Name = product1Name,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    Price = product1Price
                },
                new Product()
                {
                    Name= product2Name,
                    ProductDescription = product2Desc,
                    ProductId = product2Id,
                    Price = product2Price
                }
            };
            outcomes = new List<Product>();
        };

        Because of = () =>
        {
            for (var i = 0; i < inputs.Count; i++)
            {
                outcomes.Add(storeFront.CreateProductAsync(inputs[i].name, inputs[i].desccription, attributes, inputs[i].price, loginCreds, images).GetAwaiter().GetResult());
            }
        };

        It Should_Return_A_Fully_Formed_Product = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].ProductId.ShouldNotEqual(Guid.Empty.ToString());
                outcomes[i].ProductDescription.ShouldEqual(expectations[i].ProductDescription);
                outcomes[i].Price.ShouldEqual(expectations[i].Price);
            }
        };

        It Should_Validate_Admin_Permission = () =>
        {
            loginServiceMock.Verify(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), Moq.It.IsAny<PermissionType>(), Moq.It.IsAny<string>()), Times.Exactly(inputs.Count));
        };

        It Should_Persist_New_Product = () =>
        {
            productRepoMock.Verify(p => p.CreateAsync(Moq.It.IsAny<Product>()), Times.Exactly(inputs.Count));
        };

        It Should_Upload_Image_To_ImageRepo = () => imageRepoMock.Verify(r => r.UploadImageAsync(Moq.It.IsAny<ImageFile>()),Times.Exactly(images.Count*inputs.Count));

        private static IProductService storeFront;
        private static List<string> attributes;
        private static List<(string name, string id, string desccription, double price)> inputs;
        private static List<Product> expectations;
        private static List<Product> outcomes;
        private static List<IFormFile> images;
        private static MemoryStream stream1;
        private static MemoryStream stream2;
    }

    public class When_Modifying_A_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            oldPrice = 10.50;
            newPrice = 25.75;
            oldDescription = "old description";
            newDescription = "new description is better"; 
            oldImageStream1 = new MemoryStream(Encoding.ASCII.GetBytes("these are the old image bytes"));
            oldImageStream2 = new MemoryStream(Encoding.ASCII.GetBytes("these are the old image bytes"));
            newImageStream = new MemoryStream(Encoding.ASCII.GetBytes("these are the new image bytes"));
            oldImages = new List<byte[]>
            {
                oldImageStream1.ToArray(),
                oldImageStream2.ToArray(),
            };
            newImages = new List<byte[]>
            {
                newImageStream.ToArray()
            };
            oldAttributes = new List<string>
            {
                "Color",
                "Size"
            };
            newAttributes = new List<string>
            {
                "Color",
                "Style"
            };
            oldProduct = new Product
            {
                Name = product1Name,
                Price = oldPrice,
                ProductDescription = oldDescription,
                ProductId = product1Id,
                AvailableAttributes = oldAttributes,
                ImageBytes = oldImages
            };
            newProduct = new Product
            {
                Name = product1Name,
                Price = newPrice,
                ProductDescription = newDescription,
                ProductId = product1Id,
                AvailableAttributes = newAttributes,
                ImageBytes = newImages
            };
            accountRepoMock.Setup(l => l.GetByUsernameAsync(account1.Username)).ReturnsAsync(account1);
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), PermissionType.Admin, Moq.It.IsAny<string>())).ReturnsAsync(true);
            productRepoMock.Setup(p => p.GetByNameAsync(Moq.It.IsAny<string>())).ReturnsAsync(oldProduct);
            storeFront = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object,imageRepoMock.Object);
        };

        Because of = () => outcome = storeFront.ModifyProductAsync(newProduct).GetAwaiter().GetResult();

        //It Should_Validate_Admin_Permission = () => loginServiceMock.Verify(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), Moq.It.IsAny<PermissionType>(), Moq.It.IsAny<string>()), Times.Once);

        It Should_Return_Modified_Product = () =>
        {
            outcome.Name.ShouldEqual(newProduct.Name);
            outcome.Price.ShouldEqual(newProduct.Price);
            outcome.ProductDescription.ShouldEqual(newProduct.ProductDescription);
            outcome.ProductId.ShouldEqual(newProduct.ProductId);
            outcome.AvailableAttributes.ShouldContainOnly(newProduct.AvailableAttributes);
            outcome.ImageBytes.ShouldContainOnly(newProduct.ImageBytes);
        };

        It Should_Retrieve_Product_From_Repo = () => productRepoMock.Verify(p => p.GetByNameAsync(oldProduct.Name), Times.Once);

        It Should_Persist_Modified_Product = () => productRepoMock.Verify(p => p.UpdateAsync(Moq.It.IsAny<Product>()), Times.Once);

        private static IProductService storeFront;
        private static Product oldProduct;
        private static Product newProduct;
        private static string oldDescription;
        private static string newDescription;
        private static MemoryStream oldImageStream1;
        private static MemoryStream oldImageStream2;
        private static MemoryStream newImageStream;
        private static List<byte[]> oldImages;
        private static List<byte[]> newImages;
        private static List<string> oldAttributes;
        private static List<string> newAttributes;
        private static double oldPrice;
        private static double newPrice;
        private static Product outcome;
    }

    public class When_Getting_All_Products : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            products = new List<Product>
            {
                new Product
                {
                    Name = product1Name,
                    Price = product1Price,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                },
                new Product
                {
                    Name= product2Name,
                    Price = product2Price,
                    ProductDescription = product2Desc,
                    ProductId = product2Id,
                }
            };
            productRepoMock.Setup(p => p.GetAllProductsAsync()).ReturnsAsync(products);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            expectations = products;
            outcomes = new List<Product>();
        };

        Because of = () => outcomes = productService.GetAllAsync().GetAwaiter().GetResult().ToList();

        It Should_Return_All_Products_From_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].ProductDescription.ShouldEqual(expectations[i].ProductDescription);
                outcomes[i].Price.ShouldEqual(expectations[i].Price);
                outcomes[i].Id.ShouldNotEqual(Guid.Empty.ToString());
            }
        };

        It Should_Call_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                productRepoMock.Verify(p => p.GetAllProductsAsync(), Times.Once);
            }
        };

        private static ProductService productService;
        private static List<Product> expectations;
        private static List<Product> outcomes;
        private static List<Product> products;
    }

    public class When_Getting_Product_By_Name : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            product1 = new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            };
            product2 = new Product
            {
                Name = product2Name,
                Price = product2Price,
                ProductDescription = product2Desc,
                ProductId = product2Id,
            };
            products = new List<Product>
            {
                product1,
                product2
            };
            productRepoMock.Setup(p => p.GetByNameAsync(product1Name)).ReturnsAsync(product1);
            productRepoMock.Setup(p => p.GetByNameAsync(product2Name)).ReturnsAsync(product2);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            expectations = products;
            outcomes = new List<Product>();
        };

        Because of = () =>
        {
            for (var i = 0; i < products.Count; i++)
            {
                outcomes.Add(productService.GetByNameAsync(products[i].Name).GetAwaiter().GetResult());
            }
        };

        It Should_Return_Named_Product = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                outcomes[i].Name.ShouldEqual(expectations[i].Name);
                outcomes[i].ProductDescription.ShouldEqual(expectations[i].ProductDescription);
                outcomes[i].Price.ShouldEqual(expectations[i].Price);
                outcomes[i].Id.ShouldNotEqual(Guid.Empty.ToString());
            }
        };

        It Should_Get_Product_From_Repo = () =>
        {
            for (var i = 0; i < expectations.Count; i++)
            {
                productRepoMock.Verify(p => p.GetByNameAsync(products[i].Name), Times.Once());
            }
        };

        private static ProductService productService;
        private static List<Product> expectations;
        private static List<Product> outcomes;
        private static Product product1;
        private static Product product2;
        private static List<Product> products;
    }

    public class When_Creating_An_Item_For_A_Product_Without_Image : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            hats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = colors[i%3]
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = sizes[i%4]
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = hatTypes[i%2]
                        }
                    },
                    Credentials = loginCreds,

                    ImageBytes = new List<byte[]> { Encoding.ASCII.GetBytes("these are the image bytes") }
                };
                var stream = new MemoryStream(Encoding.ASCII.GetBytes("these are the image bytes"));
                images = new List<FormFile>
            {
                new FormFile(stream,0,stream.Length,"hatImage","hatImageName")
            };
                hats.Add(newHat);
            }
            for (var i = 0; i < hats.Count; i++)
            {
                itemRepoMock.Setup(r => r.CreateAsync(hats[i])).ReturnsAsync(hats[i]);
            }
            hatOutcomes = new List<Item>();
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), PermissionType.Admin, Moq.It.IsAny<string>())).ReturnsAsync(true);
            productRepoMock.Setup(p => p.GetByProductIdAsync(product1Id)).ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            for (var i = 0; i < 10; i++)
            {
                itemRepoMock.Setup(p => p.CreateAsync(Moq.It.IsAny<Item>())).ReturnsAsync(hats[i]);
            }
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () =>
        {
            for (var i = 0; i < hats.Count; i++)
            {
                var hat = productService.CreateItemAsync(product1Id, hats[i]).GetAwaiter().GetResult();
                hatOutcomes.Add(hat);
            }
            hatOutcomes.OrderBy(o => o.SKU).ToList();
            hats.OrderBy(o => o.SKU).ToList();
        };

        It Should_Validate_Admin_Permission = () =>
        {
            loginServiceMock.Verify(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), Moq.It.IsAny<PermissionType>(), Moq.It.IsAny<string>()), Times.Exactly(hats.Count));
        };

        It Should_Return_Item = () =>
        {
            for (var i = 0; i < hats.Count; i++)
            {
                hatOutcomes[i].Name.ShouldEqual(hats[i].Name);
                hatOutcomes[i].Price.ShouldEqual(hats[i].Price);
                hatOutcomes[i].ProductDescription.ShouldEqual(hats[i].ProductDescription);
                hatOutcomes[i].SKU.ShouldNotEqual(Guid.Empty.ToString());
                hatOutcomes[i].Attributes.OrderBy(o => o.Type);
                var outAttributes = hats.Where(h => h.SKU == hatOutcomes[i].SKU).FirstOrDefault().Attributes.OrderBy(o => o.Type).ToList();
                for (var j = 0; j < outAttributes.Count; j++)
                {
                    hatOutcomes[i].Attributes[j].Value.ShouldEqual(outAttributes[j].Value);
                }
            }
        };

        It Should_Find_Product_In_Repo = () =>
        {
            productRepoMock.Verify(r => r.GetByProductIdAsync(product1Id), Times.Exactly(hats.Count));
        };

        It Should_Persist_Item_In_Repo = () =>
        {
            itemRepoMock.Verify(r => r.CreateAsync(Moq.It.IsAny<Item>()), Times.Exactly(hats.Count));
        };

        private static IProductService productService;
        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<string> prod1skus;
        private static List<Item> hats;
        private static List<string> shirtTypes;
        private static List<string> prod2Skus;
        private static List<Item> shirts;
        private static List<Item> hatOutcomes;
        private static List<Item> shirtOutcomes;
        private static List<FormFile> images;
    }

    public class When_Creating_Items_For_A_Product_Without_Image : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            attributes = new List<ItemAttribute>
            {
                new ItemAttribute
                {
                    Type = "Color",
                    Value = "Red"
                },
                new ItemAttribute
                {
                    Type= "Size",
                    Value = "L"
                },
                new ItemAttribute
                {
                    Type = "Style",
                    Value = "Fedora"
                }
            };
            itemQuantity = 10;
            hats = new List<Item>();
            for (var i = 0; i < itemQuantity; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = product1Price,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = attributes,
                    ImageBytes = new List<byte[]> { Encoding.ASCII.GetBytes("these are the image bytes") }
                };
                var stream = new MemoryStream(Encoding.ASCII.GetBytes("these are the image bytes"));
                images = new List<FormFile>
            {
                new FormFile(stream,0,stream.Length,"hatImage","hatImageName")
            };
                hats.Add(newHat);
            }
            for (var i = 0; i < hats.Count; i++)
            {
                itemRepoMock.Setup(r => r.CreateAsync(hats[i])).ReturnsAsync(hats[i]);
            }
            hatOutcomes = new List<Item>();
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), PermissionType.Admin, Moq.It.IsAny<string>())).ReturnsAsync(true);
            productRepoMock.Setup(p => p.GetByNameAsync(product1Name)).ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            for (var i = 0; i < itemQuantity; i++)
            {
                itemRepoMock.Setup(p => p.CreateAsync(Moq.It.IsAny<Item>())).ReturnsAsync(hats[i]);
            }
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () => hatOutcomes = productService.CreateManyItemsAsync(product1Name, itemQuantity, attributes, loginCreds).GetAwaiter().GetResult().ToList();

        It Should_Validate_Admin_Permission = () =>
        {
            loginServiceMock.Verify(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), Moq.It.IsAny<PermissionType>(), Moq.It.IsAny<string>()), Times.Once);
        };

        It Should_Return_Item = () =>
        {
            for (var i = 0; i < itemQuantity; i++)
            {
                hatOutcomes[i].Name.ShouldEqual(hats[i].Name);
                hatOutcomes[i].Price.ShouldEqual(hats[i].Price);
                hatOutcomes[i].ProductDescription.ShouldEqual(hats[i].ProductDescription);
                hatOutcomes[i].SKU.ShouldNotEqual(Guid.Empty.ToString());
                hatOutcomes[i].Attributes.Select(s => s.Value).ShouldContain(attributes[0].Value);
                hatOutcomes[i].Attributes.Select(s => s.Value).ShouldContain(attributes[1].Value);
                hatOutcomes[i].Attributes.Select(s => s.Value).ShouldContain(attributes[2].Value);
            }
        };

        It Should_Find_Product_In_Repo = () =>
        {
            productRepoMock.Verify(r => r.GetByNameAsync(product1Name), Times.Once);
        };

        It Should_Persist_Item_In_Repo = () =>
        {
            itemRepoMock.Verify(r => r.CreateAsync(Moq.It.IsAny<Item>()), Times.Exactly(itemQuantity));
        };

        private static IProductService productService;
        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<ItemAttribute> attributes;
        private static int itemQuantity;
        private static List<string> prod1skus;
        private static List<Item> hats;
        private static List<string> shirtTypes;
        private static List<string> prod2Skus;
        private static List<Item> shirts;
        private static List<Item> hatOutcomes;
        private static List<Item> shirtOutcomes;
        private static List<FormFile> images;
    }

    public class When_Upadting_A_Product_With_An_Image : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            attributes = new List<ItemAttribute>
            {
                new ItemAttribute
                {
                    Type = "Color",
                    Value = "Blue"
                }
            };
            product = new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
                AvailableAttributes = product1AvailableAttributes
            };
            hat = new Item
            {
                Name = product.Name,
                Price = product.Price,
                ProductDescription = product.ProductDescription,
                ProductId = product.Id,
                Credentials = loginCreds,
                Attributes = attributes,
                SKU = "SKU",
            };
            var stream = new MemoryStream(Encoding.ASCII.GetBytes("these are the image bytes"));
            images = new List<IFormFile>
            {
                new FormFile(stream,0,stream.Length,"hatImage","hatImageName")
            };
            imageRepoMock.Setup(r => r.UploadImageAsync(Moq.It.IsAny<ImageFile>()));
            itemRepoMock.Setup(r => r.CreateAsync(Moq.It.IsAny<Item>())).ReturnsAsync(hat);
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(Moq.It.IsAny<Account>(), PermissionType.Admin, Moq.It.IsAny<string>())).ReturnsAsync(true);
            productRepoMock.Setup(p => p.GetByProductIdAsync(product1Id)).ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            productRepoMock.Setup(p => p.UpdateAsync(Moq.It.IsAny<Product>()));
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () => productService.UpdateProductWithImageAsync(product.ProductId, images).GetAwaiter().GetResult();

        It Should_Find_Product_In_Repo = () => productRepoMock.Verify(p => p.GetByProductIdAsync(Moq.It.IsAny<string>()), Times.Once());

        It Should_Call_Product_Repo_To_Update_Product = () => productRepoMock.Verify(p => p.UpdateAsync(Moq.It.IsAny<Product>()), Times.Once());

        It Should_Store_Image_In_ImageRepo = () => imageRepoMock.Verify(r => r.UploadImageAsync(Moq.It.IsAny<ImageFile>()), Times.Once);

        private static List<ItemAttribute> attributes;
        private static Item hat;
        private static List<IFormFile> images;
        private static Product product;
        private static IProductService productService;
    }

    public class When_Getting_All_Items_For_A_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            hats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = colors[i%3]
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = sizes[i%4]
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = hatTypes[i%2]
                        }
                    }
                };
                hats.Add(newHat);
            }
            for (var i = 0; i < hats.Count; i++)
            {
                itemRepoMock.Setup(r => r.CreateAsync(hats[i])).ReturnsAsync(hats[i]);
            }
            hatOutcomes = new List<Item>();
            itemRepoMock.Setup(p => p.GetAllItemsAsync(product1Id)).ReturnsAsync(hats);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () =>
        {
            hatOutcomes = productService.GetItemsAsync(product1Id).GetAwaiter().GetResult().ToList();
        };

        It Should_Return_All_Items_For_The_Product = () =>
        {
            for (var i = 0; i < hats.Count; i++)
            {
                hatOutcomes[i].Name.ShouldEqual(hats[i].Name);
                hatOutcomes[i].ProductId.ShouldEqual(hats[i].ProductId);
                hatOutcomes[i].Price.ShouldEqual(hats[i].Price);
                hatOutcomes[i].ProductDescription.ShouldEqual(hats[i].ProductDescription);
                hatOutcomes[i].SKU.ShouldEqual(hats[i].SKU);
                var outAttributes = hats.Where(h => h.SKU == hatOutcomes[i].SKU).FirstOrDefault().Attributes.OrderBy(o => o.Type).ToList();
                for (var j = 0; j < outAttributes.Count; j++)
                {
                    hatOutcomes[i].Attributes[j].Value.ShouldEqual(outAttributes[j].Value);
                }
            }
        };

        It Should_Get_The_Items_From_The_Repo = () => itemRepoMock.Verify(i => i.GetAllItemsAsync(product1Id), Times.Once());

        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<Item> hats;
        private static List<Item> hatOutcomes;
        private static ProductService productService;
    }

    public class When_Getting_All_Item_Attributes_For_A_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            attributeTypes = new List<string>
            {
                "Color",
                "Size",
                "Style"
            };
            attributeValues = new List<string>
            {
                "Red","Green","Black",
                "S","M","L","XL",
                "Ballcap","Fedora"
            };
            attributes = new List<ItemAttribute>
            {
                new ItemAttribute
                {
                    Type = "Color",
                    Value = "Red"
                },
                new ItemAttribute
                {
                    Type = "Color",
                    Value = "Green"
                },
                new ItemAttribute
                {
                    Type = "Color",
                    Value = "Black"
                },
                new ItemAttribute
                {
                    Type = "Size",
                    Value = "S"
                },
                new ItemAttribute
                {
                    Type= "Size",
                    Value = "M"
                },
                new ItemAttribute
                {
                    Type= "Size",
                    Value = "L"
                },
                new ItemAttribute
                {
                    Type= "Size",
                    Value = "XL"
                },
                new ItemAttribute
                {
                    Type = "Style",
                    Value = "Ballcap"
                },
                new ItemAttribute
                {
                    Type = "Style",
                    Value = "Fedora"
                }
            };
            hats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = colors[i%3]
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = sizes[i%4]
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = hatTypes[i%2]
                        }
                    }
                };
                hats.Add(newHat);
            }
            itemRepoMock.Setup(i => i.GetAllItemsAsync(product1Name)).ReturnsAsync(hats);
            for (var i = 0; i < attributeTypes.Count; i++)
            {
                for (var j = 0; j < attributeValues.Count; j++)
                {
                    itemRepoMock.Setup(p => p.GetByAttributeAsync(product1Name, attributeTypes[i], attributeValues[j]))
                    .ReturnsAsync(hats.Where(h => h.Attributes.Where(a => a.Value == attributeValues[j]).Any()));
                }
            }
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            attributeOutcome = new List<GroupedAttributes>();
        };

        Because of = () => attributeOutcome = productService.GetAttributesAsync(product1Name).GetAwaiter().GetResult().ToList();

        It Should_Return_A_List_Of_Attributes = () =>
        {
            var expectations = attributes.GroupBy(attribute => attribute.Type, attribute => attribute.Value, (type, value) =>
            new
            {
                Type = type.ToString(),
                Value = value.ToHashSet(),
            }).ToList();
            for (var i = 0; i < expectations.Count(); i++)
            {
                attributeOutcome[i].Type.ShouldEqual(expectations[i].Type);
                attributeOutcome[i].Value.ShouldEqual(expectations[i].Value);
            }
        };

        It Should_Get_Attributes_From_ItemRepo = () => itemRepoMock.Verify(r => r.GetAllItemsAsync(product1Name), Times.Once);

        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<string> attributeTypes;
        private static List<string> attributeValues;
        private static List<ItemAttribute> attributes;
        private static List<Item> hats;
        private static ProductService productService;
        private static List<GroupedAttributes> attributeOutcome;
    }

    public class When_Getting_All_Available_Attributes_For_A_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            product = new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
                AvailableAttributes = product1AvailableAttributes
            };
            productRepoMock.Setup(p => p.GetByNameAsync(Moq.It.IsAny<string>())).ReturnsAsync(product);
            service = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () => attributes = service.GetAvailableAttributes(product.Name).GetAwaiter().GetResult();

        It Should_Find_Product_In_Repo = () => productRepoMock.Verify(p => p.GetByNameAsync(product.Name), Times.Once());

        It Should_Return_Only_Available_Attributes = () => attributes.ShouldContainOnly(attributes);

        private static Product product;
        private static ProductService service;
        private static List<string> attributes;
    }

    public class When_Geting_Items_By_Attribute : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            attributes = new List<string>
            {
                "Color",
                "Size",
                "Style"
            };
            attributeValues = new List<string>
            {
                "Red","Green","Black",
                "S","M","L","XL",
                "Ballcap","Fedora"
            };
            hats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = colors[i%3]
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = sizes[i%4]
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = hatTypes[i%2]
                        }
                    }
                };
                hats.Add(newHat);
            }
            productRepoMock.Setup(p => p.GetByNameAsync(product1Name))
            .ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            for (var i = 0; i < attributes.Count; i++)
            {
                for (var j = 0; j < attributeValues.Count; j++)
                {
                    itemRepoMock.Setup(p => p.GetByAttributeAsync(product1Name, attributes[i].ToString(), attributeValues[j]))
                    .ReturnsAsync(hats.Where(h => h.Attributes.Where(a => a.Value == attributeValues[j]).Any()));
                }
            }
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            redItems = new List<Item>();
            greenItems = new List<Item>();
            blackItems = new List<Item>();
            sizeItems = new List<Item>();
            smallItems = new List<Item>();
            mediumItems = new List<Item>();
            largeItems = new List<Item>();
            xlItems = new List<Item>();
            styleItems = new List<Item>();
            fedoraItems = new List<Item>();
            ballcapItems = new List<Item>();
        };

        Because of = () =>
        {
            redItems = productService.GetByAttributeAsync(product1Id, "Color", "Red").GetAwaiter().GetResult();
            greenItems = productService.GetByAttributeAsync(product1Id, "Color", "Green").GetAwaiter().GetResult();
            blackItems = productService.GetByAttributeAsync(product1Id, "Color", "Black").GetAwaiter().GetResult();
            smallItems = productService.GetByAttributeAsync(product1Id, "Size", "S").GetAwaiter().GetResult();
            mediumItems = productService.GetByAttributeAsync(product1Id, "Size", "M").GetAwaiter().GetResult();
            largeItems = productService.GetByAttributeAsync(product1Id, "Size", "L").GetAwaiter().GetResult();
            xlItems = productService.GetByAttributeAsync(product1Id, "Size", "XL").GetAwaiter().GetResult();
            fedoraItems = productService.GetByAttributeAsync(product1Id, "Style", "Fedora").GetAwaiter().GetResult();
            ballcapItems = productService.GetByAttributeAsync(product1Id, "Style", "Ballcap").GetAwaiter().GetResult();
        };

        It Should_Return_All_Items_Matching_Attribute = () =>
        {
            red = hats.Where(h => h.Attributes.Where(a => a.Value == "Red").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                redItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "Red" });
            }
            green = hats.Where(h => h.Attributes.Where(a => a.Value == "Green").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                greenItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "Green" });
            }
            black = hats.Where(h => h.Attributes.Where(a => a.Value == "Black").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                blackItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "Black" });
            }
            small = hats.Where(h => h.Attributes.Where(a => a.Value == "S").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                smallItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "S" });
            }
            medium = hats.Where(h => h.Attributes.Where(a => a.Value == "M").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                mediumItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "M" });
            }
            large = hats.Where(h => h.Attributes.Where(a => a.Value == "L").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                largeItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "L" });
            }
            xl = hats.Where(h => h.Attributes.Where(a => a.Value == "XL").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                xlItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "XL" });
            }
            fedoras = hats.Where(h => h.Attributes.Where(a => a.Value == "Fedora").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                fedoraItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "Fedora" });
            }
            ballcaps = hats.Where(h => h.Attributes.Where(a => a.Value == "Ballcap").Any()).ToList();
            for (var i = 0; i < redItems.Count(); i++)
            {
                ballcapItems.ToList()[i].Attributes.ShouldContain(new ItemAttribute { Type = "Color", Value = "Ballcap" });
            }
        };

        It Should_Get_Items_From_Repo = () => itemRepoMock.Verify(i => i.GetByAttributeAsync(Moq.It.IsAny<string>(), Moq.It.IsAny<string>(), Moq.It.IsAny<string>()), Times.Exactly(9));

        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<string> attributeValues;
        private static List<string> attributes;
        private static List<Item> hats;
        private static ProductService productService;
        private static IEnumerable<Item> redItems;
        private static IEnumerable<Item> greenItems;
        private static IEnumerable<Item> blackItems;
        private static IEnumerable<Item> sizeItems;
        private static IEnumerable<Item> smallItems;
        private static IEnumerable<Item> mediumItems;
        private static IEnumerable<Item> largeItems;
        private static IEnumerable<Item> xlItems;
        private static IEnumerable<Item> styleItems;
        private static IEnumerable<Item> fedoraItems;
        private static IEnumerable<Item> ballcapItems;
        private static List<Item> red;
        private static List<Item> green;
        private static List<Item> black;
        private static List<Item> small;
        private static List<Item> medium;
        private static List<Item> large;
        private static List<Item> xl;
        private static List<Item> fedoras;
        private static List<Item> ballcaps;
    }

    public class When_Geting_Items_For_A_Product : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            attributes = new List<string>
            {
                "Color",
                "Size",
                "Style"
            };
            attributeValues = new List<string>
            {
                "Red","Green","Black",
                "S","M","L","XL",
                "Ballcap","Fedora"
            };
            hats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = colors[i%3]
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = sizes[i%4]
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = hatTypes[i%2]
                        }
                    }
                };
                hats.Add(newHat);
            }
            productRepoMock.Setup(p => p.GetByProductIdAsync(product1Id))
            .ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            productRepoMock.Setup(p => p.GetByNameAsync(product1Name))
            .ReturnsAsync(new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            });
            itemRepoMock.Setup(i => i.GetAllItemsAsync(product1Name)).ReturnsAsync(hats);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            items = new List<Item>();
        };

        Because of = () => items = productService.GetItemsAsync(product1Name).GetAwaiter().GetResult().ToList();

        It Should_Return_All_Items_For_Product = () =>
        {
            items.Count.ShouldEqual(hats.Count);
        };

        It Should_Get_Items_From_Repo = () =>
        {
            itemRepoMock.Verify(i => i.GetAllItemsAsync(Moq.It.IsAny<string>()), Times.Once);
        };

        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<string> attributes;
        private static List<string> attributeValues;
        private static List<Item> hats;
        private static ProductService productService;
        private static List<Item> items;
    }

    public class When_Purchasing_An_Item : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            qty = 3;
            colors = new List<string>
            {
                "Red","Green","Black"
            };
            sizes = new List<string>
            {
                "S","M","L","XL"
            };
            hatTypes = new List<string>
            {
                "Ballcap","Fedora"
            };
            attributes = new List<string>
            {
                "Color",
                "Size",
                "Style"
            };
            attributeValues = new List<string>
            {
                "Red","Green","Black",
                "S","M","L","XL",
                "Ballcap","Fedora"
            };
            product = new Product
            {
                Name = product1Name,
                Price = product1Price,
                ProductDescription = product1Desc,
                ProductId = product1Id,
            };
            hatDTO = new ItemDTO
            {
                Name = product1Name,
                Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = "Black"
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = "M"
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = "Ballcap"
                        }
                    },
                Credentials = loginCreds
            };
            selectedHats = new List<Item>();
            for (var i = 0; i < 10; i++)
            {
                var newHat = new Item
                {
                    Name = product1Name,
                    Price = 19.99,
                    ProductDescription = product1Desc,
                    ProductId = product1Id,
                    SKU = Guid.NewGuid().ToString(),
                    Attributes = new List<ItemAttribute>
                    {
                        new ItemAttribute
                        {
                            Type = "Color",
                            Value = "Black"
                        },
                        new ItemAttribute
                        {
                            Type = "Size",
                            Value = "M"
                        },
                        new ItemAttribute
                        {
                            Type = "Style",
                            Value = "Ballcap"
                        }
                    },
                    Credentials = loginCreds
                };
                selectedHats.Add(newHat);
            }
            productRepoMock.Setup(p => p.GetByProductIdAsync(product1Id)).ReturnsAsync(product);
            productRepoMock.Setup(p => p.GetByNameAsync(product1Name)).ReturnsAsync(product);
            loginServiceMock.Setup(l => l.ValidateTokenAsync(Moq.It.IsAny<string>(), Moq.It.IsAny<string>())).ReturnsAsync(true);
            loginServiceMock.Setup(l => l.ValidatePermissionsAsync(account1, PermissionType.User, Moq.It.IsAny<string>())).ReturnsAsync(true);
            accountRepoMock.Setup(a => a.GetByUsernameAsync(Moq.It.IsAny<string>())).ReturnsAsync(account1);
            itemRepoMock.Setup(i => i.GetByAttributesAsync(product1Name, Moq.It.IsAny<List<ItemAttribute>>())).ReturnsAsync(selectedHats);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
            items = new List<Item>();
        };

        Because of = () => items = productService.PurchaseItem(hatDTO,qty).GetAwaiter().GetResult();

        It Should_Return_Items_To_Purchase = () =>
        {
            for(var i=0; i<items.Count; i++)
            {
                selectedHats[0].Attributes.OrderBy(o => o.Type).ToList();
                items[i].Name.ShouldEqual(product1Name);
                items[i].Attributes.OrderBy(o => o.Type).ToList();
                for (var j = 0; j < items[i].Attributes.Count; j++)
                {
                    items[i].Attributes[j].Type.ShouldEqual(selectedHats[0].Attributes[j].Type);
                    items[i].Attributes[j].Value.ShouldEqual(selectedHats[0].Attributes[j].Value);
                }

            }
        };

        It Should_Validate_Account_Token = () => loginServiceMock.Verify(l => l.ValidateTokenAsync(Moq.It.IsAny<string>(), Moq.It.IsAny<string>()), Times.Once);

        It Should_Validate_User_Permission = () =>
        {
            loginServiceMock.Verify(l => l.ValidatePermissionsAsync(account1, PermissionType.User, Moq.It.IsAny<string>()), Times.Once);
        };

        It Should_Delete_The_Item_From_Repo = () => itemRepoMock.Verify(r => r.DeleteItemAsync(Moq.It.IsAny<Item>()), Times.Exactly(qty));

        It Should_Get_The_Account_From_Repo = () => accountRepoMock.Verify(a => a.GetByUsernameAsync(account1.Username), Times.Once);

        It Should_Add_The_Price_To_Account_Balance = () => accountRepoMock.Verify(r => r.UpdateAsync(Moq.It.IsAny<Account>()), Times.Once);

        private static int qty;
        private static List<string> colors;
        private static List<string> sizes;
        private static List<string> hatTypes;
        private static List<string> attributes;
        private static List<string> attributeValues;
        private static Product product;
        private static ItemDTO hatDTO;
        private static List<Item> selectedHats;
        private static IProductService productService;
        private static List<Item> items;
    }

    public class When_Getting_All_Images_For_Site : With_ProductRepo_Setup
    {
        Establish context = () =>
        {
            //var stream = new MemoryStream(Encoding.ASCII.GetBytes("these are the image bytes"));
            //images = new List<IFormFile>
            //{
            //    new FormFile(stream,0,stream.Length,"hatImage","hatImageName")
            //};
            images = new List<ImageFile>
            {
                new ImageFile
                {
                    Name = "image1",
                    ImageId = Guid.NewGuid().ToString(),
                    Image = Encoding.ASCII.GetBytes("the first image bytes")
                },
                new ImageFile
                {
                    Name = "image2",
                    ImageId = Guid.NewGuid().ToString(),
                    Image = Encoding.ASCII.GetBytes("the second image bytes")
                }
            };
            imageRepoMock.Setup(r => r.GetAll()).Returns(images);
            productService = new ProductService(productRepoMock.Object, itemRepoMock.Object, accountRepoMock.Object, loginServiceMock.Object, imageRepoMock.Object);
        };

        Because of = () => outcome = productService.GetAllImages();

        It Should_Return_A_List_Of_ImageFiles = () =>
        {
            for (var i = 0; i < outcome.ToList().Count; i++)
            {
                outcome.Where(o => o.Name == images[i].Name).FirstOrDefault().ImageId.ShouldEqual(images[i].ImageId);
                outcome.Where(o => o.Name == images[i].Name).FirstOrDefault().Image.ShouldEqual(images[i].Image);
            }
        };

        It Should_Get_Images_From_ImageRepo = () => imageRepoMock.Verify(r => r.GetAll(), Times.Once);

        private static List<ImageFile> images;
        private static IProductService productService;
        private static IEnumerable<ImageFile> outcome;
    }
}
