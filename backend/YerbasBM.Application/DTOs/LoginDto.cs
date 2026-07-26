using System.ComponentModel.DataAnnotations;

namespace YerbasBM.Application.DTOs;

/// <summary>
/// Credenciales enviadas por el dueño del emprendimiento para iniciar sesión
/// en el panel admin — ver sección 10 de CONTEXTO.md.
/// </summary>
public class LoginDto
{
    /// <summary>Nombre de usuario del admin.</summary>
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña en texto plano (se valida contra el hash almacenado).</summary>
    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    public string Password { get; set; } = string.Empty;
}
