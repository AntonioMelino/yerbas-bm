using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using YerbasBM.Application.Interfaces;
using YerbasBM.Domain.Entities;

namespace YerbasBM.Infrastructure.Services;

/// <summary>
/// Implementación de <see cref="ITokenGenerator"/> que emite JWTs firmados con
/// HMAC-SHA256, usando la configuración de la sección <c>Jwt</c> (ver sección 10 de CONTEXTO.md).
/// </summary>
public class JwtTokenGenerator : ITokenGenerator
{
    private readonly IConfiguration _configuration;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAtUtc) GenerateToken(AdminUser adminUser)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var key = jwtSection["Key"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException(
                "Falta configurar Jwt:Key (user-secrets o variable de entorno Jwt__Key).");
        }

        // Con HMAC-SHA256, una key corta es forjable offline por fuerza bruta.
        // Exigimos al menos 32 bytes (256 bits) de entropía.
        if (Encoding.UTF8.GetByteCount(key) < 32)
        {
            throw new InvalidOperationException(
                "Jwt:Key es demasiado corta: debe tener al menos 32 bytes (256 bits) para HMAC-SHA256.");
        }

        var expirationMinutes = int.TryParse(jwtSection["ExpirationMinutes"], out var minutes) ? minutes : 480;
        var expiresAtUtc = DateTime.UtcNow.AddMinutes(expirationMinutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, adminUser.Id.ToString()),
            new Claim(ClaimTypes.Name, adminUser.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: signingCredentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
    }
}
