namespace School.WebAPI.Models;

public sealed class Student
{
    public Student()
    {
        Id = Guid.CreateVersion7();
    }
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string IdentityNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
}