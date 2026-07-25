namespace YerbasBM.Application.DTOs;

/// <summary>
/// Representación de un producto expuesta por la API (lectura).
/// </summary>
public class ProductDto
{
    /// <summary>Identificador único del producto.</summary>
    public Guid Id { get; set; }

    /// <summary>Nombre del producto.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Descripción larga del producto.</summary>
    public string? Description { get; set; }

    /// <summary>Precio unitario del producto.</summary>
    public decimal Price { get; set; }

    /// <summary>Cantidad disponible en stock.</summary>
    public int Stock { get; set; }

    /// <summary>URL pública de la imagen del producto.</summary>
    public string? ImageUrl { get; set; }

    /// <summary>Id de la categoría a la que pertenece el producto (null si no tiene).</summary>
    public Guid? CategoryId { get; set; }

    /// <summary>Nombre de la categoría a la que pertenece el producto (null si no tiene).</summary>
    public string? CategoryName { get; set; }

    /// <summary>Indica si el producto está visible en el catálogo.</summary>
    public bool IsActive { get; set; }

    /// <summary>Indica si el producto se destaca en la home.</summary>
    public bool IsFeatured { get; set; }
}
