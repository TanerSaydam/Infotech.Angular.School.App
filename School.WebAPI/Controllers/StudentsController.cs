using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Dtos;
using School.WebAPI.Models;
using TS.Result;

namespace School.WebAPI.Controllers;

[ApiController]
[Route("/students")]
public sealed class StudentsController(ApplicationDbContext dbContext)
{
    [HttpPost]
    public async Task<Result<string>> Create([FromForm] CreateStudentDto request, CancellationToken cancellationToken)
    {
        var fileName = DateTime.Now.ToFileTime() + "_" + request.File.FileName;
        using (var stream = new FileStream($"wwwroot/{fileName}", FileMode.Create))
        {
            request.File.CopyTo(stream);
        }

        Student student = request.Adapt<Student>();
        student.ImageUrl = fileName;
        dbContext.Add(student);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<string>.Succeed("Öğrenci başarıyla kaydedildi");
    }


    [HttpPut]
    public async Task<Result<string>> Update([FromForm] UpdateStudentDto request, CancellationToken cancellationToken)
    {
        Student? student = await dbContext.Students.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (student is null)
        {
            return Result<string>.Failure("Öğrenci bulunamadı");
        }

        string? fileName = null;
        if (request.File is not null)
        {
            fileName = DateTime.Now.ToFileTime() + "_" + request.File.FileName;
            using (var stream = new FileStream($"wwwroot/{fileName}", FileMode.Create))
            {
                request.File.CopyTo(stream);
            }

            File.Delete("wwwroot/" + student.ImageUrl);
        }

        request.Adapt(student);

        if (fileName is not null)
        {
            student.ImageUrl = fileName;
        }
        dbContext.Update(student);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<string>.Succeed("Öğrenci başarıyla güncellendi");
    }
}
