using System.Runtime;

var builder = WebApplication.CreateBuilder(args);

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

app.UseCors("AllowFrontend");

app.MapGet("/api/projects", () => {
    var projects = new[]
    {
        new
        {
            Id = 1,
            Title = "Anthony Asmus",
            Description = "A personal portfolio built with React, TypeScript, and ASP.NET Core.",
            Tech = new[] { "React", "TypeScript", "C#", "ASP.NET Core" },
            Url = "https://example.com"
        },
        new
        {
            Id = 2,
            Title = "Cool App",
            Description = "Another project I built.",
            Tech = new[] { "C#", "PostgreSQL" },
            Url = "https://example.com"
        }
    };

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
