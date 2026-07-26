using YerbasBM.Application.DTOs;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Lógica de negocio de autenticación del panel admin: valida credenciales
/// contra <see cref="IAdminUserRepository"/> y emite el JWT de sesión.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Valida usuario/contraseña y, si son correctos, devuelve el JWT firmado.
    /// Devuelve null si el usuario no existe o la contraseña no coincide.
    /// </summary>
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}
