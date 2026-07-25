using System.ComponentModel.DataAnnotations;

namespace YerbasBM.Application.DTOs;

/// <summary>
/// Datos requeridos para crear una categoría desde el panel admin.
/// El slug se genera automáticamente a partir del nombre (ver <see cref="Common.SlugGenerator"/>).
/// </summary>
public class CreateCategoryDto
{
    /// <summary>Nombre visible de la categoría (ej. "Yerba Mate").</summary>
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string Name { get; set; } = string.Empty;
}
