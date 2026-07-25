using YerbasBM.Domain.Entities;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Contrato de acceso a datos para productos. La implementación concreta
/// (EF Core) vive en YerbasBM.Infrastructure, siguiendo el patrón Repository.
/// </summary>
public interface IProductRepository
{
    /// <summary>
    /// Devuelve los productos activos, incluyendo su categoría. Si <paramref name="categorySlug"/>
    /// se especifica, filtra solo los productos de esa categoría (ver GET /api/products?category={slug}).
    /// </summary>
    Task<List<Product>> GetActiveAsync(string? categorySlug = null);

    /// <summary>Busca un producto por id, incluyendo su categoría. Devuelve null si no existe.</summary>
    Task<Product?> GetByIdAsync(Guid id);

    /// <summary>Agrega un nuevo producto al contexto (no persiste hasta llamar a SaveChangesAsync).</summary>
    Task AddAsync(Product product);

    /// <summary>Marca un producto para ser eliminado (no persiste hasta llamar a SaveChangesAsync).</summary>
    Task DeleteAsync(Product product);

    /// <summary>Persiste los cambios pendientes en la base de datos.</summary>
    Task SaveChangesAsync();
}
