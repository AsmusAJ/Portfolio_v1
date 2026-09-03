using System.Runtime;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var PortfolioDbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    PortfolioDbContext.Database.EnsureDeleted();
    PortfolioDbContext.Database.EnsureCreated();
    var seeder = new DatabaseSeeder();
    seeder.SeedData(PortfolioDbContext);
}

app.UseCors("AllowFrontend");

app.MapGet(
    "/api/work-experiences",
    async (PortfolioDbContext PortfolioDbContext) =>
    {
        var workExperiences = await PortfolioDbContext
            .WorkExperiences.Include(w => w.Tags)
            .Select(w => new WorkExperienceDto
            {
                Id = w.Id,
                Title = w.Title,
                Company = w.Company,
                CompanyUrl = w.CompanyUrl,
                Description = w.Description,
                Tags = w.Tags.Select(t => t.Name).ToList(),
            })
            .ToListAsync();

        return Results.Ok(workExperiences);
    }
);

app.MapGet(
    "/api/top-work-experiences",
    async (PortfolioDbContext PortfolioDbContext) =>
    {
        var workExperiences = await PortfolioDbContext
            .WorkExperiences.OrderByDescending(w => w.Priority)
            .ThenBy(w => w.Id)
            .Take(2)
            .Select(w => new WorkExperienceDto
            {
                Id = w.Id,
                Title = w.Title,
                Company = w.Company,
                CompanyUrl = w.CompanyUrl,
                Description = w.Description,
                Tags = w.Tags.Select(t => t.Name).ToList(),
            })
            .ToListAsync();

        return Results.Ok(workExperiences);
    }
);

app.MapGet(
    "/api/projects",
    async (PortfolioDbContext PortfolioDbContext) =>
    {
        var projects = await PortfolioDbContext
            .Projects.Include(p => p.Tags)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Url = p.Url,
                Tags = p.Tags.Select(t => t.Name).ToList(),
            })
            .ToListAsync();

        return Results.Ok(projects);
    }
);
app.MapGet(
    "/api/top-projects",
    async (PortfolioDbContext PortfolioDbContext) =>
    {
        var projects = await PortfolioDbContext
            .Projects.OrderByDescending(w => w.Priority)
            .ThenBy(w => w.Id)
            .Take(2)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Url = p.Url,
                Tags = p.Tags.Select(t => t.Name).ToList(),
            })
            .ToListAsync();

        return Results.Ok(projects);
    }
);

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
