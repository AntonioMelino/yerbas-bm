using Microsoft.EntityFrameworkCore;
using YerbasBM.Application.Interfaces;
using YerbasBM.Application.Services;
using YerbasBM.Infrastructure.Data;
using YerbasBM.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core + PostgreSQL (Supabase). La connection string se toma de
// ConnectionStrings:DefaultConnection (appsettings.json o variable de entorno
// ConnectionStrings__DefaultConnection, para no commitear credenciales reales).
builder.Services.AddDbContext<YerbasBMDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios y servicios de Categorías (Clean Architecture: Infrastructure implementa
// las interfaces definidas en Application).
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
