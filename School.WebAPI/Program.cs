using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using School.WebAPI.Context;
using TS.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCors();

builder.AddNpgsqlDbContext<ApplicationDbContext>("school", null, options =>
{
    options.UseSnakeCaseNamingConvention();
});

builder.AddServiceDefaults();

builder.Services.AddControllers();

builder.Services.AddEndpoint();

builder.Services.AddResponseCompression(opt =>
{
    opt.EnableForHttps = true;
});

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

app.UseHttpsRedirection();

app.UseCors(x => x
.AllowAnyHeader()
.AllowAnyOrigin()
.AllowAnyMethod()
.SetPreflightMaxAge(TimeSpan.FromMinutes(10)));

app.UseResponseCompression();

app.UseStaticFiles();

app.MapDefaultEndpoints();

app.MapGet("/update-database",
    (ApplicationDbContext dbContext)
    => dbContext.Database.Migrate());

app.MapEndpoints();

app.MapControllers();

app.Run();