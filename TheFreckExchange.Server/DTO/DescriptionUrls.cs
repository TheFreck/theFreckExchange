namespace TheFreckExchange.Server.DTO
{
    public static class DescriptionUrls
    {
        public static string Bowler = "https://en.wikipedia.org/wiki/Bowler_hat";
        public static string Trilby = "https://en.wikipedia.org/wiki/Trilby";
        public static string Porkpie = "https://en.wikipedia.org/wiki/Pork_pie_hat";
        public static string Ballcap = "https://en.wikipedia.org/wiki/Baseball_cap";
        public static string Fedora = "https://en.wikipedia.org/wiki/Fedora";
        public static string WritingCap = "https://en.wikipedia.org/wiki/Flat_cap";

        public static string GetUrl(string name)
        {
            switch (name)
            {
                case "Bowler":
                case "bowler":
                    return Bowler;
                case "Trilby":
                case "trilby":
                    return Trilby;
                case "Porkpie":
                case "porkpie":
                    return Porkpie;
                case "Ballcap":
                case "ballcap":
                    return Ballcap;
                case "Fedora":
                case "fedora":
                    return Fedora;
                case "WritingCap":
                case "writingCap":
                case "writingcap":
                case "Writing Cap":
                case "writing cap":
                    return WritingCap;
                default: return name;
            }
        }
    }
}
