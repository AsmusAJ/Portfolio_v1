public class DatabaseSeeder
{
    public void SeedData(PortfolioDbContext db)
    {
        if (db.Projects.Any())
        {
            return;
        }

        db.Projects.AddRange(
            new Project
            {
                Title = "Anthony Asmus",
                Description = "A personal portfolio built with React, TypeScript, and ASP.NET Core."
            },
            new Project
            {
                Title = "Cool App",
                Description = "Another project I built."
            });

        db.SaveChanges();
    }
}
