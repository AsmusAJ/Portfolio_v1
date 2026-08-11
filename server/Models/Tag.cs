public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
}
