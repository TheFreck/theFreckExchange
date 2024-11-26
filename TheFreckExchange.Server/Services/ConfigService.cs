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
            var updatedConfig = new ConfigDTO
            {
                AdminAccountId = configDTO.AdminAccountId != null && configDTO.AdminAccountId != string.Empty ? configDTO.AdminAccountId : config.AdminAccountId,
                Background = configDTO.Background != null && configDTO.Background.Name != string.Empty
                                && configDTO.Background.ImageId != string.Empty
                                && configDTO.Background.Image != null ? configDTO.Background : config.Background,
                CategoryTitle = configDTO.CategoryTitle != null && configDTO.CategoryTitle != string.Empty ? configDTO.CategoryTitle : config.CategoryTitle,
                Categories = configDTO.Categories != null && configDTO.Categories.Count > 0 ? configDTO.Categories : config.Categories,
                SiteTitle = configDTO.SiteTitle != null && configDTO.SiteTitle != string.Empty ? configDTO.SiteTitle : config.SiteTitle,
                ImageFiles = config.ImageFiles,
                ConfigId = config.ConfigId
            };
            await configRepo.UploadNewAsync(updatedConfig);
            return updatedConfig;
        }
    }
}
