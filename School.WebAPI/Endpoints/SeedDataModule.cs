using Bogus;
using School.WebAPI.Context;
using School.WebAPI.Models;
using TS.Endpoints;

namespace School.WebAPI.Endpoints;

public sealed class SeedDataModule : IEndpoint
{
    public void AddRoutes(IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("seed-data").WithTags("SeedData");
        app.MapGet("students", async (ApplicationDbContext dbContext) =>
        {
            List<Student> students = new();
            for (int i = 0; i < 10000; i++)
            {
                Faker faker = new();
                Student student = new()
                {
                    FirstName = faker.Person.FirstName,
                    LastName = faker.Person.LastName,
                    IdentityNumber = RastgeleUret(),
                    Email = faker.Person.Email,
                    PhoneNumber = faker.Person.Phone,
                    ImageUrl = "no-user.png",
                };
                students.Add(student);
            }

            dbContext.AddRange(students);
            await dbContext.SaveChangesAsync();

            return Results.Created();
        });
    }

    public static string RastgeleUret()
    {
        Random rnd = new Random();
        int[] tc = new int[11];

        // İlk rakam 0 olamaz
        tc[0] = rnd.Next(1, 10);

        // İlk 9 haneyi rastgele üret
        for (int i = 1; i < 9; i++)
        {
            tc[i] = rnd.Next(0, 10);
        }

        // 10. hane kuralı
        tc[9] = ((tc[0] + tc[2] + tc[4] + tc[6] + tc[8]) * 7 - (tc[1] + tc[3] + tc[5] + tc[7])) % 10;

        // 11. hane kuralı
        int sumFirst10 = 0;
        for (int i = 0; i < 10; i++)
        {
            sumFirst10 += tc[i];
        }
        tc[10] = sumFirst10 % 10;

        // String olarak döndür
        return string.Join("", tc);
    }
}
