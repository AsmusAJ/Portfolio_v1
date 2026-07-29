using System.Runtime;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var PortfolioDbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    PortfolioDbContext.Database.EnsureCreated();
    var seeder = new DatabaseSeeder();
    seeder.SeedData(PortfolioDbContext);
}

app.UseCors("AllowFrontend");

app.MapGet("/api/projects", async (PortfolioDbContext PortfolioDbContext) => {
    var projects = await PortfolioDbContext.Projects.ToListAsync();

    return Results.Ok(projects);
});

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/Profile", () => {
    var profile = new
    {
        Name = "Anthony Asmus",
        Title = "Software Engineer @ UofM",
        Bio = "My mission is to create full-stack web applications that are functional, scalable, and engaging. I'm passionate about using code as both a problem-solving tool and a creative medium.",
        Links = new
        {
            GitHub = "https://github.com/AsmusAJ",
            LinkedIn = "https://www.linkedin.com/in/anthonyasmus/",
            Email = "asmusaj@umich.edu",
        }
    };

    return Results.Ok(profile);
});

app.Run();
