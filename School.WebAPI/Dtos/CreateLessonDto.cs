namespace School.WebAPI.Dtos;

public sealed record CreateLessonDto(
    string Name);

public sealed record UpdateLessonDto(
    Guid Id,
    string Name);