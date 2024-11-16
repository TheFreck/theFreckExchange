namespace TheFreckExchange.Server.DTO
{
    public class GroupedAttributes
    {
        public string Type { get; set; } = String.Empty;
        public HashSet<string> Value { get; set; } = new HashSet<string>();
    }
}
