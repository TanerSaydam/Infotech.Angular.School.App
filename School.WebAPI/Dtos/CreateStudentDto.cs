namespace School.WebAPI.Dtos;

public sealed record CreateStudentDto(
    IFormFile File,
    string FirstName,
    string LastName,
    string IdentityNumber,
    string Email,
    string PhoneNumber
    );

public sealed record UpdateStudentDto(
    Guid Id,
    IFormFile? File,
    string FirstName,
    string LastName,
    string IdentityNumber,
    string Email,
    string PhoneNumber
    );