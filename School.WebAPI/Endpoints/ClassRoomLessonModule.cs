using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Dtos;
using School.WebAPI.Models;
using TS.Endpoints;
using TS.Result;

namespace School.WebAPI.Endpoints;

public sealed class ClassRoomLessonModule : IEndpoint
{
    public void AddRoutes(IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("class-room-lessons").WithTags("ClassRoomLessons");

        app.MapGet("{classRoomId}",
            async (Guid classRoomId, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext
                .ClassRooms.Where(p => p.Id == classRoomId)
                .FirstOrDefaultAsync(cancellationToken);

                if (classRoom is null)
                {
                    return Results.NotFound();
                }

                var list = classRoom.Lessons;

                var lessons = await dbContext.Lessons.ToListAsync(cancellationToken);

                var res = list.Select(s => new
                {
                    Id = s.LessonId,
                    Name = lessons.First(p => p.Id == s.LessonId).Name,
                }).ToList();

                return Results.Ok(res);
            })
            .Produces<List<Lesson>>();

        app.MapPost(string.Empty,
            async (CreateClassRoomLessonDto request, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext
                .ClassRooms.Where(p => p.Id == request.ClassRoomId)
                .FirstOrDefaultAsync(cancellationToken);

                if (classRoom is null)
                {
                    return Results.NotFound();
                }

                classRoom.Lessons.Add(new ClassRoomLesson(request.LessonId));

                dbContext.Update(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Ders başarıyla sınıfa Eklendi"));
            })
            .Produces<Result<string>>();

        app.MapDelete("{classRoomId}/{lessonId}",
            async (Guid classRoomId, Guid lessonId, ApplicationDbContext dbContext, CancellationToken cancellationToken) =>
            {
                var classRoom = await dbContext.ClassRooms.FirstOrDefaultAsync(p => p.Id == classRoomId, cancellationToken);
                if (classRoom is null)
                {
                    return Results.NotFound(Result<string>.Failure("Sınıf bulunamadı"));
                }

                classRoom.Lessons.Remove(new ClassRoomLesson(lessonId));

                dbContext.Update(classRoom);
                await dbContext.SaveChangesAsync(cancellationToken);

                return Results.Ok(Result<string>.Succeed("Ders başarıyla sınıftan silindi"));
            })
            .Produces<Result<string>>();
    }
}
