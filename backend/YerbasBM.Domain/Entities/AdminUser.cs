namespace YerbasBM.Domain.Entities;

/// <summary>
/// Representa al usuario administrador (el dueño del emprendimiento).
/// No hay registro de clientes: este es el único rol autenticado del sistema.
/// </summary>
public class AdminUser
{
    /// <summary>Identificador único del usuario admin.</summary>
    public Guid Id { get; set; }

    /// <summary>Nombre de usuario único usado para el login.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Hash de la contraseña (bcrypt/argon2), nunca la contraseña en texto plano.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>Fecha de creación del registro.</summary>
    public DateTime CreatedAt { get; set; }
}
