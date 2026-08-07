public class WorkExperience
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string CompanyUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Priority { get; set; } = 0;
    public ICollection<Tag> Tags { get; set; } = [];
}
