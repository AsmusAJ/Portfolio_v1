public class DatabaseSeeder
{
    private readonly ILogger<DatabaseSeeder>? _logger;

    public DatabaseSeeder() { }

    public DatabaseSeeder(ILogger logger)
    {
        _logger = (ILogger<DatabaseSeeder>?)logger ?? null;
    }

    public void SeedData(PortfolioDbContext db)
    {
        try
        {
            _logger?.LogInformation("Database seeding started.");

            var possibleTagNames = new[]
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
                "Java",
                "Processing",
                "Max",
            };

            var existingTagNames = db.Tags.Select(tag => tag.Name).ToHashSet();
            var tagsToAdd = possibleTagNames
                .Where(name => !existingTagNames.Contains(name))
                .Select(name => new Tag { Name = name })
                .ToList();

            if (tagsToAdd.Count > 0)
            {
                db.Tags.AddRange(tagsToAdd);
                db.SaveChanges();
                _logger?.LogInformation($"Added {tagsToAdd.Count} new tags.");
            }

            // Only seed work experiences and projects if the database is empty
            if (db.WorkExperiences.Any() || db.Projects.Any())
            {
                _logger?.LogInformation("Database already contains work experiences or projects. Skipping content seeding.");
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
                        "A full-stack portfolio application using React, TypeScript, ASP.NET Core, and Entity Framework Core to deliver a responsive, data-driven web experience.",
                    Url = "https://github.com/AsmusAJ/Portfolio_v1",
                    Priority = 200,
                    Tags = tags.Where(t => new[] { "C#", "ASP.NET", "TypeScript", "React" }.Contains(t.Name)).ToList(),
                },
                new Project
                {
                    Title = "TTRPG Campaign Manager App (Collaborative)",
                    Description = "A full-stack web application for managing collaborative tabletop RPG campaigns, including user authentication, campaign/character creation, session tracking, and secure access controls for multi-user data.",
                    Url = "https://github.com/AsmusAJ/dnd-plus-plus",
                    Priority = 100,
                    Tags = tags.Where(t =>
                            new[] { "Python", "Flask", "JavaScript" }.Contains(t.Name)
                        )
                        .ToList(),
                },
                new Project
                {
                    Title = "Gen-Asteroids, Procedurally Generated Soundscape",
                    Description = "An interactive game with a generative music score using Java (Processing Framework), and Max.",
                    Url = "https://github.com/AsmusAJ/gen-asteroids",
                    Priority = 50,
                    Tags = tags.Where(t =>
                            new[] { "Java", "Processing", "Max" }.Contains(t.Name)
                        )
                        .ToList(),
                }
            );

            db.SaveChanges();
            _logger?.LogInformation("Database seeding completed successfully. Work experiences and projects have been added.");
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "An error occurred during database seeding.");
            throw;
        }
    }
}
