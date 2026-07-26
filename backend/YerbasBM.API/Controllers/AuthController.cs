using Microsoft.AspNetCore.Mvc;
using YerbasBM.Application.DTOs;
using YerbasBM.Application.Interfaces;

namespace YerbasBM.API.Controllers;

/// <summary>
/// Login del panel admin — único rol autenticado del sistema (no hay
/// registro de clientes). Ver sección 10 de CONTEXTO.md.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>Valida usuario/contraseña y devuelve el JWT de sesión si son correctos.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            if (result is null)
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
            }

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            // Jwt:Key no está configurado en este entorno (ver backend/README.md).
            _logger.LogError(ex, "No se pudo emitir el JWT: falta configuración.");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Login no disponible: falta configuración del servidor." });
        }
    }
}
