using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;

namespace TheFreckExchange.Server.Services
{
    public interface IConfigService
    {
        ConfigDTO CreateNew(ConfigDTO config);
        Task<ConfigDTO> GetConfigAsync();
        Task<ConfigDTO> UpdateConfigAsync(ConfigDTO configDTO);
    }

    public class ConfigService : IConfigService
    {
        private readonly IConfigRepo configRepo;

        public ConfigService(IConfigRepo configRepo)
        {
            this.configRepo = configRepo;
        }

        public ConfigDTO CreateNew(ConfigDTO config)
        {
            configRepo.UploadNewAsync(config);
            return config;
        }

        public async Task<ConfigDTO> GetConfigAsync()
        {
            var config = await configRepo.GetConfigAsync();
            return config;
        }

        public async Task<ConfigDTO> UpdateConfigAsync(ConfigDTO configDTO)
        {
            var config = await configRepo.GetConfigAsync();
            if(configDTO.ImageFiles != null && configDTO.ImageFiles.Count > 0) config.ImageFiles.AddRange(configDTO.ImageFiles);
            config.SiteTitle = String.IsNullOrWhiteSpace(configDTO.SiteTitle) ? config.SiteTitle : configDTO.SiteTitle;
            config.CategoryTitle = String.IsNullOrWhiteSpace(configDTO.CategoryTitle) ? config.CategoryTitle : configDTO.CategoryTitle;
            config.Background = String.IsNullOrWhiteSpace(configDTO.Background.ImageId) ? config.Background : configDTO.Background;
            config.AdminAccountId = String.IsNullOrWhiteSpace(configDTO.AdminAccountId) ? config.AdminAccountId : configDTO.AdminAccountId;
            config.Categories = configDTO.Categories.Where(c => !String.IsNullOrWhiteSpace(c.Name)).Count() != 6 ? config.Categories : configDTO.Categories;
            config.ImageFiles = configDTO?.ImageFiles?.Count > 0 ? config.ImageFiles.Concat(configDTO.ImageFiles).ToList() : config.ImageFiles;

            await configRepo.UploadNewAsync(config);
            return config;
        }
    }
}
