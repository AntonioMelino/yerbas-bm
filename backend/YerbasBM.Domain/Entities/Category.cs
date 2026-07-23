namespace YerbasBM.Domain.Entities;

/// <summary>
/// Representa una categoría de productos (ej. "Yerba Mate", "Termos").
/// Las categorías se crean dinámicamente desde el panel admin, no son un enum fijo.
/// </summary>
public class Category
{
    /// <summary>Identificador único de la categoría.</summary>
    public Guid Id { get; set; }

    /// <summary>Nombre visible de la categoría (ej. "Yerba Mate").</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Slug único usado para filtrar productos por URL (ej. "yerba-mate").</summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>Fecha de creación del registro.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Productos que pertenecen a esta categoría.</summary>
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
