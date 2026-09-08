using System.Runtime;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? ["http://localhost:5173"]; // Fallback for development

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

var app = builder.Build();

// Add forwarded headers for reverse proxy (Nginx/Cloudflare)
app.UseForwardedHeaders();

// Initialize database and seed if needed
using (var scope = app.Services.CreateScope())
{
    try
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        var portfolioDbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
        
        logger.LogInformation("Initializing database...");
        portfolioDbContext.Database.EnsureCreated();
        
        var seeder = new DatabaseSeeder(logger);
        seeder.SeedData(portfolioDbContext);
        
        logger.LogInformation("Database initialization completed successfully.");
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database initialization. The application will attempt to continue.");
    }
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

app.MapGet("/api/health", async (PortfolioDbContext db, ILogger<Program> logger) =>
{
    try
    {
        // Check if database is accessible
        var canConnectDb = await db.Database.CanConnectAsync();
        
        if (!canConnectDb)
        {
            logger.LogWarning("Health check failed: database connection unavailable");
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        }

        // Check if we can query the database
        var projectCount = await db.Projects.CountAsync();
        var experienceCount = await db.WorkExperiences.CountAsync();
        
        return Results.Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            database = new
            {
                connected = true,
                projects = projectCount,
                workExperiences = experienceCount
            }
        });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Health check failed with exception");
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
});

app.Run();
