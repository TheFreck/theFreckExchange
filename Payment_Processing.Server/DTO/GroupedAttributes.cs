namespace Payment_Processing.Server.DTO
{
    public class GroupedAttributes
    {
        public string Type { get; set; }
        public HashSet<string> Value { get; set; }
    }
}
