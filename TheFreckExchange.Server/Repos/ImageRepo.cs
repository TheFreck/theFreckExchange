using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TheFreckExchange.Server.DTO;

namespace TheFreckExchange.Server.Repos
{
    public interface IImageRepo
    {
        IEnumerable<ImageFile> GetAll();
        Task<ImageFile> GetBackgroundImageAsync(string imageId);
        Task<IEnumerable<ImageFile>> GetImageFilesAsync(IEnumerable<string> list);
        Task UploadImageAsync(ImageFile imageFile);
        Task UploadImagesAsync(IEnumerable<ImageFile> imageFiles);
    }
    public class ImageRepo : IImageRepo
    {
        private readonly IMongoCollection<ImageFile> imageCollection;
        private readonly ILogger<ImageRepo> logger;

        public ImageRepo(IOptions<MongoSettings> settings, ILogger<ImageRepo> logger)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            imageCollection = mongoDatabase.GetCollection<ImageFile>(settings.Value.ImageCollectionName);
            this.logger = logger;
            logger.LogInformation("Constructed Image Repo");
        }

        public IEnumerable<ImageFile> GetAll()
        {
            logger.LogInformation("Get all images");
            return imageCollection.AsQueryable();
        }

        public async Task<ImageFile> GetBackgroundImageAsync(string imageId)
        {
            logger.LogInformation("Get background image");
            return (await imageCollection.FindAsync(i => i.ImageId == imageId)).FirstOrDefault();
        }

        public async Task<IEnumerable<ImageFile>> GetImageFilesAsync(IEnumerable<string> imageIds)
        {
            logger.LogInformation("Get image files from IDs: ");
            foreach (var imageId in imageIds)
            {
                logger.LogInformation($"{imageId}, ");
            }
            return (await imageCollection.FindAsync(i => imageIds.Contains(i.ImageId))).ToEnumerable();
        }

        public async Task UploadImageAsync(ImageFile imageFile)
        {
            logger.LogInformation($"Upload image file: {imageFile.Name}");
            await imageCollection.InsertOneAsync(imageFile);
        }

        public async Task UploadImagesAsync(IEnumerable<ImageFile> imageFiles)
        {
            logger.LogInformation($"Upload multiple image files: ");
            foreach (var imageFile in imageFiles)
            {
                logger.LogInformation($"{imageFile.Name}, ");
            }
            await imageCollection.InsertManyAsync(imageFiles);
        }
    }
}
