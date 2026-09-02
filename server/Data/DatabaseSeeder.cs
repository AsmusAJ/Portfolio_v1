public class DatabaseSeeder
{
    public void SeedData(PortfolioDbContext db)
    {
        var possibleTaskNames = new[]
        {
            "C#",
            "ASP.NET",
            "MVC",
            "SQL",
            "JavaScript",
            "TypeScript",
            "React",
            "HTML",
            "CSS",
            "Python",
            "WinForms",
            "EF Core",
            "Flask",
        };

        var existingTagNames = db.Tags.Select(tag => tag.Name).ToHashSet();
        db.Tags.AddRange(
            possibleTaskNames
                .Where(name => !existingTagNames.Contains(name))
                .Select(name => new Tag { Name = name })
        );
        db.SaveChanges();

        if (db.WorkExperiences.Any() || db.Projects.Any())
        {
            return;
        }

        var tags = db.Tags.ToList();
        db.WorkExperiences.AddRange(
            new WorkExperience
            {
                Title = "Software Engineer Intern",
                Description =
                    "Developed an end-to-end React and ASP.NET Core feature that analyzes historical asset data and recommends alarm thresholds, helping users configure monitoring rules through an intuitive GUI.",
                Company = "KCF Technologies",
                CompanyUrl = "https://kcftech.com/",
                Priority = 200,
                Tags = tags.Where(t => new[] { "C#", "ASP.NET", "Python", "TypeScript", "React" }.Contains(t.Name)).ToList(),
            },
            new WorkExperience
            {
                Title = "Programmer Analyst Intern",
                Description = "Designed database management system using Microsoft SQL Server, C#.NET and WinForms, facilitating standard naming conventions to enable cross-location data analysis.",
                Company = "Howmet Aerospace",
                CompanyUrl = "https://howmet.com/",
                Priority = 100,
                Tags = tags.Where(t =>
                        new[] { "C#", "WinForms", "EF Core"}.Contains(t.Name)
                    )
                    .ToList(),
            }
        );

        db.Projects.AddRange(
            new Project
            {
                Title = "Portfolio Website",
                Description =
                    "Developed a full-stack portfolio application using React, TypeScript, ASP.NET Core, and Entity Framework Core to deliver a responsive, data-driven web experience.",
                Url = "https://kcftech.com/",
                Priority = 200,
                Tags = tags.Where(t => new[] { "C#", "ASP.NET", "TypeScript", "React" }.Contains(t.Name)).ToList(),
            },
            new Project
            {
                Title = "TTRPG Campaign Manager App (Collaborative)",
                Description = "Built a full-stack web application for managing collaborative tabletop RPG campaigns, including user authentication, campaign/character creation, session tracking, and secure access controls for multi-user data.",
                Url = "https://howmet.com/",
                Priority = 100,
                Tags = tags.Where(t =>
                        new[] { "Python", "Flask", "JavaScript" }.Contains(t.Name)
                    )
                    .ToList(),
            }
        );

        db.SaveChanges();
    }
}
