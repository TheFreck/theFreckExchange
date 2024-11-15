namespace TheFreckExchange.Server.DTO
{
    public class LoginCredentials
    {
        public required string Username { get; set; }
        public required string LoginToken { get; set; }
        public string UserToken { get; set; }
        public string AdminToken { get; set; }
    }
}
