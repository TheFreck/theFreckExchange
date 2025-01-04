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
            var admins = await accountRepo.GetAdminsAsync();
            config.ConfigId = Guid.NewGuid().ToString();
            foreach(var admin in admins.ToList())
            {
                admin.SiteConfigId = config.ConfigId;
                accountRepo.Update(admin);
                config.AdminAccountIds.Add(admin.AccountId);
            }
            await configRepo.ReplaceConfigAsync(config);
            return config;
        }

        public async Task<ConfigDTO> DeleteConfigAsync()
        {
            var config = await configRepo.GetConfigAsync();
            var admins = await accountRepo.GetAdminsAsync();
            foreach(var admin in admins)
            {
                admin.SiteConfigId = String.Empty;
                accountRepo.Update(admin);
            }
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
            config.AdminAccountIds = configDTO.AdminAccountIds;
            config.Categories = configDTO?.Categories.Where(c => !String.IsNullOrWhiteSpace(c.Name)).Count() != 6 ? config.Categories : configDTO.Categories;
            config.Images = configDTO?.Images?.Count > 0 ? config.Images.Concat(configDTO.Images).ToHashSet().ToList() : config.Images;

            await configRepo.ReplaceConfigAsync(config);
            return config;
        }
    }
}
