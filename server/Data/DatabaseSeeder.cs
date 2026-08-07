public class DatabaseSeeder
{
    public void SeedData(PortfolioDbContext db)
    {
        if (db.Tags.Any() || db.WorkExperiences.Any())
        {
            return;
        }

        db.Tags.AddRange(
            new Tag { Name = "C#" },
            new Tag { Name = "ASP.NET" },
            new Tag { Name = "MVC" },
            new Tag { Name = "SQL" },
            new Tag { Name = "JavaScript" },
            new Tag { Name = "TypeScript" },
            new Tag { Name = "React" },
            new Tag { Name = "HTML" },
            new Tag { Name = "CSS" }
        );
        db.SaveChanges();

        var tags = db.Tags.ToList();
        db.WorkExperiences.AddRange(
            new WorkExperience
            {
                Title = "Software Engineer Intern",
                Description = "Worked as a member of the dev team including the front-to-back creation of a new module using mvc.  Helped redesign the setup tutorials.  Also contributed to the development of a new feature.",
                Company = "KCF Technologies",
                CompanyUrl = "https://kcftech.com/",
                Priority = 200,
                Tags = tags.Where(t => new[] { "C#", "ASP.NET", "MVC", "SQL" }.Contains(t.Name)).ToList()
            },
            new WorkExperience
            {
                Title = "Programmer Analyst Intern",
                Description = "Worked on various programming tasks and analysis projects.",
                Company = "Howmet Aerospace",
                CompanyUrl = "https://howmet.com/",
                Priority = 100,
                Tags = tags.Where(t => new[] { "C#", "ASP.NET", "MVC", "SQL" }.Contains(t.Name)).ToList()
            });

        db.SaveChanges();
    }
}
