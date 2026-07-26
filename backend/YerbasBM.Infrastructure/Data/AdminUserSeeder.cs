using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using YerbasBM.Domain.Entities;

namespace YerbasBM.Infrastructure.Data;

/// <summary>
/// Crea el único usuario admin del sistema la primera vez que la API arranca
/// contra una base vacía (no hay endpoint de registro — sección 10 de CONTEXTO.md).
/// Lee las credenciales de <c>Seed:AdminUsername</c>/<c>Seed:AdminPassword</c>
/// (user-secrets o variables de entorno, nunca hardcodeadas ni commiteadas).
/// </summary>
public static class AdminUserSeeder
{
    public static async Task SeedAsync(YerbasBMDbContext context, IConfiguration configuration)
    {
        var username = configuration["Seed:AdminUsername"];
        var password = configuration["Seed:AdminPassword"];
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            // Sin credenciales de seed configuradas (caso por defecto), no tocamos la
            // base — permite levantar la API sin conexión a Postgres (ej. solo health check).
            return;
        }

        if (await context.AdminUsers.AnyAsync())
        {
            return;
        }

        context.AdminUsers.Add(new AdminUser
        {
            Id = Guid.NewGuid(),
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
