using YerbasBM.Application.DTOs;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Lógica de negocio de productos: expone DTOs a los controllers y coordina
/// el acceso a datos a través de <see cref="IProductRepository"/>.
/// </summary>
public interface IProductService
{
    /// <summary>
    /// Devuelve los productos activos. Si <paramref name="categorySlug"/> se especifica,
    /// filtra solo los productos de esa categoría.
    /// </summary>
    Task<IEnumerable<ProductDto>> GetActiveAsync(string? categorySlug = null);

    /// <summary>Busca un producto por id. Devuelve null si no existe.</summary>
    Task<ProductDto?> GetByIdAsync(Guid id);

    /// <summary>Crea un producto nuevo.</summary>
    Task<ProductDto> CreateAsync(CreateProductDto dto);

    /// <summary>Actualiza un producto existente. Devuelve null si no existe.</summary>
    Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto);

    /// <summary>Elimina un producto. Devuelve false si no existía.</summary>
    Task<bool> DeleteAsync(Guid id);
}
