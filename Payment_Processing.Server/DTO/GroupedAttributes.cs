namespace Payment_Processing.Server.DTO
{
    public class GroupedAttributes
    {
        public AttributeType Type { get; set; }
        public HashSet<string> Value { get; set; }
    }
}
