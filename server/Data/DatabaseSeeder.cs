public class DatabaseSeeder
{
    public void SeedData(PortfolioDbContext db)
    {
        if (db.WorkExperiences.Any())
        {
            return;
        }

        db.WorkExperiences.AddRange(
            new WorkExperience
            {
                Title = "Software Engineer Intern",
                Description = "Worked as a member of the dev team including the front-to-back creation of a new module using mvc.  Helped redesign the setup tutorials.  Also contributed to the development of a new feature.",
                Company = "KCF Technologies",
                CompanyUrl = "https://kcftech.com/",
                Priority = 200
            },
            new WorkExperience
            {
                Title = "Programmer Analyst Intern",
                Description = "Worked on various programming tasks and analysis projects.",
                Company = "Howmet Aerospace",
                CompanyUrl = "https://howmet.com/",
                Priority = 100
            });

        db.SaveChanges();
    }
}
