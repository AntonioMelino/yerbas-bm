using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using YerbasBM.Application.Interfaces;
using YerbasBM.Application.Services;
using YerbasBM.Infrastructure.Data;
using YerbasBM.Infrastructure.Repositories;
using YerbasBM.Infrastructure.Services;

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

// Repositorios y servicios de Productos.
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

// Repositorios y servicios de autenticación admin (JWT — sección 10 de CONTEXTO.md).
builder.Services.AddScoped<IAdminUserRepository, AdminUserRepository>();
builder.Services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Subida de imágenes de producto a Supabase Storage (sección 9 de CONTEXTO.md).
// Falla recién al intentar subir una imagen si Supabase:Url/ServiceKey no están
// configurados, no al construir el servicio (no debe romper el resto de Products).
builder.Services.AddHttpClient<IProductImageStorage, SupabaseProductImageStorage>();

// Autenticación JWT: valida los tokens emitidos por JwtTokenGenerator en las
// rutas marcadas con [Authorize] (las mutaciones de admin de Categories/Products).
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"];
// Si Jwt:Key no está configurado (dev sin user-secrets), usamos una clave aleatoria
// efímera solo para que el middleware pueda inicializar sin romper endpoints no
// relacionados con auth (ej. /api/health). JwtTokenGenerator igual rechaza emitir
// tokens reales sin una key configurada, así que el login sigue fallando explícitamente.
var signingKeyBytes = string.IsNullOrWhiteSpace(jwtKey)
    ? RandomNumberGenerator.GetBytes(32)
    : Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(signingKeyBytes)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (string.IsNullOrWhiteSpace(jwtKey))
{
    // Log ruidoso a propósito: sin Jwt:Key el login queda deshabilitado (500 explícito),
    // y sin esta alerta el problema recién se nota cuando alguien intenta loguearse.
    app.Logger.LogWarning(
        "Jwt:Key no está configurado. El login de admin (/api/auth/login) va a fallar hasta que se configure (user-secrets o variable de entorno Jwt__Key, mínimo 32 bytes).");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Crea el único admin del sistema si la tabla admin_users está vacía y hay
// credenciales configuradas en Seed:AdminUsername/Seed:AdminPassword (ver README).
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<YerbasBMDbContext>();
    await AdminUserSeeder.SeedAsync(dbContext, app.Configuration);
}

app.Run();
