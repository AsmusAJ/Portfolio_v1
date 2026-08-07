using Microsoft.EntityFrameworkCore;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }

    public DbSet<WorkExperience> WorkExperiences => Set<WorkExperience>();

    public DbSet<Tag> Tags => Set<Tag>();
}
