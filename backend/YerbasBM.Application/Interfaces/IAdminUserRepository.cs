using YerbasBM.Domain.Entities;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Contrato de acceso a datos para el usuario administrador. La implementación
/// concreta (EF Core) vive en YerbasBM.Infrastructure, siguiendo el patrón Repository.
/// </summary>
public interface IAdminUserRepository
{
    /// <summary>Busca un admin por nombre de usuario. Devuelve null si no existe.</summary>
    Task<AdminUser?> GetByUsernameAsync(string username);
}
