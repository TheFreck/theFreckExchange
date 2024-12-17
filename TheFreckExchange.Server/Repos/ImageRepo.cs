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

        public ImageRepo(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.Database);
            imageCollection = mongoDatabase.GetCollection<ImageFile>(settings.Value.ImageCollectionName);
        }

        public IEnumerable<ImageFile> GetAll()
        {
            return imageCollection.AsQueryable();
        }

        public async Task<ImageFile> GetBackgroundImageAsync(string imageId)
        {
            return (await imageCollection.FindAsync(i => i.ImageId == imageId)).FirstOrDefault();
        }

        public async Task<IEnumerable<ImageFile>> GetImageFilesAsync(IEnumerable<string> imageIds)
        {
            return (await imageCollection.FindAsync(i => imageIds.Contains(i.ImageId))).ToEnumerable();
        }

        public async Task UploadImageAsync(ImageFile imageFile)
        {
            await imageCollection.InsertOneAsync(imageFile);
        }

        public async Task UploadImagesAsync(IEnumerable<ImageFile> imageFiles)
        {
            await imageCollection.InsertManyAsync(imageFiles);
        }
    }
}
