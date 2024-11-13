using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Payment_Processing.Server.DTO;

namespace Payment_Processing.Server.Repos
{
    public interface IImageRepo
    {
        IEnumerable<ImageFile> GetAll();
        Task UploadImageAsync(ImageFile imageFile);
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

        public async Task UploadImageAsync(ImageFile imageFile)
        {
            await imageCollection.InsertOneAsync(imageFile);
        }
    }
}
