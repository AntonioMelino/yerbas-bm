namespace YerbasBM.Domain.Entities;

/// <summary>
/// Representa un producto del catálogo (yerba, mate, termo, bombilla, etc.).
/// Cada producto tiene un precio fijo; no hay variaciones por presentación.
/// </summary>
public class Product
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

    /// <summary>URL pública de la imagen del producto en Supabase Storage.</summary>
    public string? ImageUrl { get; set; }

    /// <summary>Id de la categoría a la que pertenece el producto (nullable: la FK permite null en el esquema SQL).</summary>
    public Guid? CategoryId { get; set; }

    /// <summary>Categoría a la que pertenece el producto.</summary>
    public Category? Category { get; set; }

    /// <summary>
    /// Indica si el producto está visible en el catálogo. Permite ocultar
    /// productos sin borrarlos (soft hide en vez de delete).
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Indica si el producto se destaca en la home.</summary>
    public bool IsFeatured { get; set; }

    /// <summary>Fecha de creación del registro.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Fecha de la última actualización del registro.</summary>
    public DateTime UpdatedAt { get; set; }
}
