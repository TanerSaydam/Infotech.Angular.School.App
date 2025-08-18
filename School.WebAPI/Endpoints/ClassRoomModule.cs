using Mapster;
using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Dtos;
using School.WebAPI.Models;
using TS.Endpoints;
using TS.Result;

namespace School.WebAPI.Endpoints;

public sealed class ClassRoomModule : IEndpoint
{
    public void AddRoutes(IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("class-rooms").WithTags("ClassRooms");

        app.MapGet(string.Empty,
            async (ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var res = await dbContext.ClassRooms.OrderBy(p => p.Name).ToListAsync(cancellationToken);
                return res;
            })
            .Produces<List<ClassRoom>>();

        app.MapGet("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var res = await dbContext.ClassRooms.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                return res;
            })
            .Produces<ClassRoom>();

        app.MapPost(string.Empty,
            async (CreateClassRoomDto request, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = request.Adapt<ClassRoom>();
                dbContext.Add(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Sınıf başarıyla kaydedili"));
            })
            .Produces<Result<string>>();

        app.MapPut(string.Empty,
            async (UpdateClassRoomDto request, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext.ClassRooms.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                if (classRoom is null)
                {
                    return Results.NotFound(Result<string>.Failure("Sınıf bulunamadı"));
                }
                request.Adapt(classRoom);
                dbContext.Update(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Sınıf başarıyla güncellendi"));
            })
            .Produces<Result<string>>();

        app.MapDelete("{id}",
            async (Guid id, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext.ClassRooms.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                if (classRoom is null)
                {
                    return Results.NotFound(Result<string>.Failure("Sınıf bulunamadı"));
                }
                dbContext.Remove(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Sınıf başarıyla silindi"));
            })
            .Produces<Result<string>>();
    }
}
