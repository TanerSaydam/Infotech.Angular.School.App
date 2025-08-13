using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using School.WebAPI.Context;
using School.WebAPI.Dtos;
using School.WebAPI.Models;
using TS.Result;

namespace School.WebAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ValuesController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpPut]
    public async Task<IActionResult> Update([FromForm] UpdateStudentDto request, CancellationToken cancellationToken)
    {
        Student? student = await dbContext.Students.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (student is null)
        {
            return NotFound(Result<string>.Failure("Öğrenci bulunamadı"));
        }

        string? fileName = null;
        if (request.File is not null)
        {
            fileName = DateTime.Now.ToFileTime() + "_" + request.File.FileName;
            using (var stream = new FileStream($"wwwroot/{fileName}", FileMode.Create))
            {
                request.File.CopyTo(stream);
            }

            System.IO.File.Delete("wwwroot/" + student.ImageUrl);
        }

        request.Adapt(student);

        if (fileName is not null)
        {
            student.ImageUrl = fileName;
        }
        dbContext.Update(student);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(Result<string>.Succeed("Öğrenci başarıyla güncellendi"));
    }
}
