using System.ComponentModel.DataAnnotations;

namespace YerbasBM.Application.DTOs;

/// <summary>
/// Datos requeridos para actualizar una categoría existente.
/// Si el nombre cambia, el slug se regenera automáticamente.
/// </summary>
public class UpdateCategoryDto
{
    /// <summary>Nuevo nombre visible de la categoría.</summary>
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string Name { get; set; } = string.Empty;
}
