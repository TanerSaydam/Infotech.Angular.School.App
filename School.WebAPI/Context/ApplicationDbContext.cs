using Microsoft.EntityFrameworkCore;
using School.WebAPI.Models;

namespace School.WebAPI.Context;

public sealed class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }
    public DbSet<ClassRoom> ClassRooms { get; set; }
}