using TheFreckExchange.Server.DTO;
using TheFreckExchange.Server.Repos;

namespace TheFreckExchange.Server.Services
{
    public interface IConfigService
    {
        Task<ConfigDTO> CreateNewAsync(ConfigDTO config);
        Task<ConfigDTO> DeleteConfigAsync();
        Task<ConfigDTO> GetConfigAsync();
        Task<ConfigDTO> UpdateConfigAsync(ConfigDTO configDTO);
    }

    public class ConfigService : IConfigService
    {
        private readonly IConfigRepo configRepo;
        private readonly IAccountRepo accountRepo;
        private readonly IProductRepo productRepo;

        public ConfigService(IConfigRepo configRepo, IAccountRepo accountRepo, IProductRepo productRepo)
        {
            this.configRepo = configRepo;
            this.accountRepo = accountRepo;
            this.productRepo = productRepo;
        }

        public async Task<ConfigDTO> CreateNewAsync(ConfigDTO config)
        {
            config.ConfigId = Guid.NewGuid().ToString();
            await configRepo.ReplaceConfigAsync(config);
            var admin = await accountRepo.GetByAccountIdAsync(config.AdminAccountId);
            admin.SiteConfigId = config.ConfigId;
            accountRepo.Update(admin);
            return config;
        }

        public async Task<ConfigDTO> DeleteConfigAsync()
        {
            var config = await configRepo.GetConfigAsync();
            if (config != null)
            {
                return await configRepo.DeleteConfigAsync();
            }
            else
            {
                return new ConfigDTO();
            }
        }

        public async Task<ConfigDTO> GetConfigAsync()
        {
            var config = await configRepo.GetConfigAsync();
            return config;
        }

        public async Task<ConfigDTO> UpdateConfigAsync(ConfigDTO configDTO)
        {
            var config = await configRepo.GetConfigAsync();
            if(configDTO.Images != null && configDTO.Images.Count > 0) config.Images.AddRange(configDTO.Images);
            config.SiteTitle = String.IsNullOrWhiteSpace(configDTO.SiteTitle) ? config == null ? String.Empty : config.SiteTitle : configDTO.SiteTitle;
            config.CategoryTitle = String.IsNullOrWhiteSpace(configDTO.CategoryTitle) ? config.CategoryTitle : configDTO.CategoryTitle;
            config.Background = String.IsNullOrWhiteSpace(configDTO?.Background) ? config.Background : configDTO.Background;
            config.AdminAccountId = String.IsNullOrWhiteSpace(configDTO?.AdminAccountId) ? config.AdminAccountId : configDTO.AdminAccountId;
            config.Categories = configDTO?.Categories.Where(c => !String.IsNullOrWhiteSpace(c.Name)).Count() != 6 ? config.Categories : configDTO.Categories;
            config.Images = configDTO?.Images?.Count > 0 ? config.Images.Concat(configDTO.Images).ToHashSet().ToList() : config.Images;

            await configRepo.ReplaceConfigAsync(config);
            return config;
        }
    }
}
