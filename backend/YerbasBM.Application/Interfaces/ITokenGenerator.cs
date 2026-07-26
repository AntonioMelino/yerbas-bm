using YerbasBM.Domain.Entities;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Genera el token de sesión para un admin autenticado. La implementación
/// concreta (JWT) vive en YerbasBM.Infrastructure, para no acoplar la lógica
/// de negocio al formato/librería de token elegido.
/// </summary>
public interface ITokenGenerator
{
    /// <summary>Genera un token firmado para el usuario dado, junto con su fecha de expiración UTC.</summary>
    (string Token, DateTime ExpiresAtUtc) GenerateToken(AdminUser adminUser);
}
