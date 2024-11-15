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
        new public string Name { get; set; }
        [BsonElement("AccountId")]
        new public string AccountId { get; init; }
        [BsonElement("UserName")]
        public string Username {  get; set; }
        [BsonElement("Password")]
        public string Password;
        public string Email { get; set; }
        public double Balance { get; set; }
        public DateTime DateOpened { get; set; }
        public List<AccountPermissions> Permissions { get; set; }

        /// <summary>
        /// a token that is created when an account is checked out and destroyed when it is checked back in 
        /// </summary>
        public string LoginToken { get; set; } = Guid.Empty.ToString();
        public byte[] PasswordSalt {  get; set; }
        public byte[] TokenSalt;


        public Account(string name, string username, string password, string email, List<AccountPermissions> permissions)
        {
            Username = username;
           
            Email = email;
            DateOpened = DateTime.Now;
            Name = name;
            AccountId = Guid.NewGuid().ToString();
            LoginToken = Guid.Empty.ToString();
            Permissions = permissions;
        }

        public Account() 
        {
            Username = "NullAccount";
            Email = "null@null.null";
            Name = "NullName";
            AccountId = Guid.Empty.ToString();
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
}