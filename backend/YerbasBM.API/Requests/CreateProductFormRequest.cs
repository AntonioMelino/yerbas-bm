using System.ComponentModel.DataAnnotations;

namespace YerbasBM.API.Requests;

/// <summary>
/// Datos de un producto nuevo recibidos como multipart/form-data (incluye el
/// archivo de imagen, que se sube a Supabase Storage antes de crear el producto).
/// </summary>
public class CreateProductFormRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(200, ErrorMessage = "El nombre no puede superar los 200 caracteres.")]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0.")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo.")]
    public int Stock { get; set; }

    public Guid? CategoryId { get; set; }

    public bool IsFeatured { get; set; }

    /// <summary>Imagen del producto (JPG/PNG/WebP, máx. 2 MB). Obligatoria al crear.</summary>
    [Required(ErrorMessage = "La imagen del producto es obligatoria.")]
    public IFormFile Image { get; set; } = null!;
}
