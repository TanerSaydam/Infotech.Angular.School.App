namespace School.WebAPI.Models;

public sealed class Lesson
{
    public Lesson()
    {
        Id = Guid.CreateVersion7();
    }
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
}
