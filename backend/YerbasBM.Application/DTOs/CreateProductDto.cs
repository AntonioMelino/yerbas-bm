using System.ComponentModel.DataAnnotations;

namespace YerbasBM.Application.DTOs;

/// <summary>
/// Datos requeridos para crear un producto desde el panel admin.
/// </summary>
public class CreateProductDto
{
    /// <summary>Nombre del producto.</summary>
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(200, ErrorMessage = "El nombre no puede superar los 200 caracteres.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>Descripción larga del producto.</summary>
    public string? Description { get; set; }

    /// <summary>Precio unitario del producto.</summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0.")]
    public decimal Price { get; set; }

    /// <summary>Cantidad disponible en stock.</summary>
    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo.")]
    public int Stock { get; set; }

    /// <summary>
    /// URL pública de la imagen ya subida a Supabase Storage. La resuelve
    /// <see cref="YerbasBM.API.Controllers.ProductsController"/> antes de llamar al
    /// servicio; el cliente nunca la manda directamente (manda el archivo).
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>Id de la categoría a la que pertenece el producto (opcional).</summary>
    public Guid? CategoryId { get; set; }

    /// <summary>Indica si el producto se destaca en la home.</summary>
    public bool IsFeatured { get; set; }
}
