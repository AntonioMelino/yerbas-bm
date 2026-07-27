using System.ComponentModel.DataAnnotations;

namespace YerbasBM.API.Requests;

/// <summary>
/// Datos de un producto existente recibidos como multipart/form-data. La imagen
/// es opcional: si no se envía, se conserva la imagen actual del producto.
/// </summary>
public class UpdateProductFormRequest
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

    public bool IsActive { get; set; }

    public bool IsFeatured { get; set; }

    /// <summary>Imagen nueva (JPG/PNG/WebP, máx. 2 MB). Si se omite, se conserva la actual.</summary>
    public IFormFile? Image { get; set; }
}
