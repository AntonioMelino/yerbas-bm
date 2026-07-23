using Microsoft.AspNetCore.Mvc;

namespace YerbasBM.API.Controllers;

/// <summary>
/// Endpoint de diagnóstico para confirmar que la API está levantada y respondiendo.
/// No depende de la base de datos: sirve para verificar el despliegue en sí mismo.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Devuelve el estado básico de la API.
    /// </summary>
    /// <returns>Objeto con status "ok" y la fecha/hora UTC actual del servidor.</returns>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "ok", timestampUtc = DateTime.UtcNow });
    }
}
