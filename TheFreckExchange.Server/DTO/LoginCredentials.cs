namespace TheFreckExchange.Server.DTO
{
    public class LoginCredentials
    {
        public required string Username { get; set; } = string.Empty;
        public required string LoginToken { get; set; } = String.Empty;
        public string UserToken { get; set; } = String.Empty;
        public string AdminToken { get; set; } = String.Empty;
    }
}
