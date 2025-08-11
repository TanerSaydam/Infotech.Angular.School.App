var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
    .AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(5432)
    .AddDatabase("school");

builder.AddProject<Projects.School_WebAPI>("school-webapi")
    .WithReference(postgres)
    .WaitFor(postgres)
    ;

builder.Build().Run();