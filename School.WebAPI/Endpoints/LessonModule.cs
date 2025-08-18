using Mapster;
using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Dtos;
using School.WebAPI.Models;
using TS.Endpoints;
using TS.Result;

namespace School.WebAPI.Endpoints;

public sealed class LessonModule : IEndpoint
{
    public void AddRoutes(IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("lessons").WithTags("Lessons");

        app.MapGet(string.Empty,
            async (ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var res = await dbContext.Lessons.OrderBy(p => p.Name).ToListAsync(cancellationToken);
                return res;
            })
            .Produces<List<Lesson>>();

        app.MapGet("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var res = await dbContext.Lessons.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                return res;
            })
            .Produces<Lesson>();

        app.MapPost(string.Empty,
            async (CreateLessonDto request, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = request.Adapt<Lesson>();
                dbContext.Add(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Ders başarıyla kaydedili"));
            })
            .Produces<Result<string>>();

        app.MapPut(string.Empty,
            async (UpdateLessonDto request, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext.Lessons.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                if (classRoom is null)
                {
                    return Results.NotFound(Result<string>.Failure("Ders bulunamadı"));
                }
                request.Adapt(classRoom);
                dbContext.Update(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Ders başarıyla güncellendi"));
            })
            .Produces<Result<string>>();

        app.MapDelete("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext.Lessons.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                if (classRoom is null)
                {
                    return Results.NotFound(Result<string>.Failure("Ders bulunamadı"));
                }
                dbContext.Remove(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Ders başarıyla silindi"));
            })
            .Produces<Result<string>>();
    }
}
