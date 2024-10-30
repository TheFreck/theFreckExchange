using Microsoft.Extensions.Logging.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace Payment_Processing.Server.Repos
{
    public sealed class MongoSettings
    {
        /// <summary>
        /// MongoDB connection string
        /// </summary>
        [Required, Url]
        public string ConnectionString { get; init; } = null;

        /// <summary>
        /// MongoDB  database name
        /// </summary>
        [Required]
        public string Database { get; init; } = null;

        [Required]
        public string CollectionName { get; init; } = null;

        [Required]
        public string AccountCollectionName { get; init; } = null;

        [Required]
        public string ProductCollectionName { get; init; } = null;

        [Required]
        public string ItemCollectionName { get; init; } = null;
    }
}
