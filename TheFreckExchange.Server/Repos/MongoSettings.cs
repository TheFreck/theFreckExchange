using Microsoft.Extensions.Logging.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace TheFreckExchange.Server.Repos
{
    public sealed class MongoSettings
    {
        /// <summary>
        /// MongoDB connection string
        /// </summary>
        [Required, Url]
        public string ConnectionString { get; init; } = String.Empty;

        /// <summary>
        /// MongoDB  database name
        /// </summary>
        [Required]
        public string Database { get; init; } = String.Empty;

        [Required]
        public string CollectionName { get; init; } = String.Empty;

        [Required]
        public string AccountCollectionName { get; init; } = String.Empty;

        [Required]
        public string ProductCollectionName { get; init; } = String.Empty;

        [Required]
        public string ItemCollectionName { get; init; } = String.Empty;
        [Required]
        public string ImageCollectionName { get; init; } = String.Empty;
    }
}
