namespace School.WebAPI.Models;

public sealed class ClassRoom
{
    public ClassRoom()
    {
        Id = Guid.CreateVersion7();
    }
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public List<ClassRoomLesson> Lessons { get; set; } = new();
}

public sealed record ClassRoomLesson(
    Guid LessonId);