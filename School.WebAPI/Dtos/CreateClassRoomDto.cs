namespace School.WebAPI.Dtos;

public sealed record CreateClassRoomDto(
    string Name);

public sealed record UpdateClassRoomDto(
    Guid Id,
    string Name);
