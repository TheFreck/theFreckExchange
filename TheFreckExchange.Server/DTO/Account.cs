using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace TheFreckExchange.Server.DTO
{
    public class Account
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = String.Empty;
        [BsonElement("AccountId")]
        public string AccountId { get; init; } = String.Empty;
        public string SiteConfigId { get; set; } = String.Empty;
        [BsonElement("Username")]
        public string Username { get; set; } = String.Empty;
        [BsonElement("Password")]
        public string Password = String.Empty;
        public string Email { get; set; } = String.Empty;
        public double Balance { get; set; } = 0;
        public DateTime? DateOpened { get; set; }
        public List<AccountPermissions> Permissions { get; set; } = new List<AccountPermissions>();
        public List<PurchaseOrder> History { get; set; }

        /// <summary>
        /// a token that is created when an account is checked out and destroyed when it is checked back in 
        /// </summary>
        public string? LoginToken { get; set; } = Guid.Empty.ToString();
        public byte[]? PasswordSalt {  get; set; } = new byte[0];
        public byte[]? TokenSalt = new byte[0];


        public Account(string name, string username, string email, List<AccountPermissions> permissions)
        {
            Username = username;
            Email = email;
            DateOpened = DateTime.Now;
            Name = name;
            AccountId = Guid.NewGuid().ToString();
            LoginToken = Guid.Empty.ToString();
            Permissions = permissions;
            History = new List<PurchaseOrder>();
        }

        public Account() 
        {
            Username = "NullAccount";
            Email = "null@null.null";
            Name = "NullName";
            AccountId = Guid.Empty.ToString();
            History = new List<PurchaseOrder>();
        }
    }

    public class AccountPermissions
    {
        public PermissionType Type { get; set; }
        public string Token { set; get; } = string.Empty;
        public byte[] TokenSalt { get; set; } = new byte[64];

        public AccountPermissions(PermissionType Type)
        {
            this.Type = Type;
        }
    }

    public enum PermissionType
    {
        Admin,User
    }

    public class PurchaseOrder 
    {
        public List<Item> Items { get; set; }
        public double TotalPrice { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}