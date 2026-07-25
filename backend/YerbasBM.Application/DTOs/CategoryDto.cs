namespace YerbasBM.Application.DTOs;

/// <summary>
/// Representación de una categoría expuesta por la API (lectura).
/// </summary>
public class CategoryDto
{
    /// <summary>Identificador único de la categoría.</summary>
    public Guid Id { get; set; }

    /// <summary>Nombre visible de la categoría.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Slug único usado para filtrar productos por URL.</summary>
    public string Slug { get; set; } = string.Empty;
}
