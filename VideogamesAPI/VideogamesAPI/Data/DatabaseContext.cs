using Microsoft.EntityFrameworkCore;

namespace VideogamesAPI.Data;

public class DatabaseContext : DbContext
{
    public DbSet<Videogame> Videogames { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }
}

public class Videogame
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Publisher { get; set; }
    public string Support { get; set; }
}