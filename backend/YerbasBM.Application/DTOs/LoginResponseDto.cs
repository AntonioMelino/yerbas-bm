namespace YerbasBM.Application.DTOs;

/// <summary>
/// Respuesta de un login exitoso: el JWT que el frontend guarda en
/// <c>localStorage</c> y reenvía en cada request a <c>/api/admin/*</c>.
/// </summary>
public class LoginResponseDto
{
    /// <summary>Token JWT firmado.</summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>Fecha/hora UTC en la que el token deja de ser válido.</summary>
    public DateTime ExpiresAtUtc { get; set; }

    /// <summary>Nombre de usuario autenticado.</summary>
    public string Username { get; set; } = string.Empty;
}
