using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Models;
using TS.Endpoints;
using TS.Result;

namespace School.WebAPI.Endpoints;

public sealed class StudentModule : IEndpoint
{
    public void AddRoutes(IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/students").WithTags("Students");

        app.MapGet(string.Empty,
            async (ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var res = await dbContext.Students
                        .OrderBy(p => p.FirstName)
                        .ToListAsync(cancellationToken);
            return res;
        })
        .Produces<List<Student>>();

        app.MapGet("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                await Task.Delay(5000);
                var res = await dbContext.Students.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                return res;
            })
        .Produces<Student>();

        app.MapDelete("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var student = await dbContext.Students.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
            if (student is null)
            {
                return Result<string>.Failure("Öğrenci bulunamadı");
            }

            dbContext.Remove(student);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result<string>.Succeed("Öğrenci başarıyla silindi");
        })
        .Produces<Result<string>>();
    }
}
