using YerbasBM.Domain.Entities;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Contrato de acceso a datos para categorías. La implementación concreta
/// (EF Core) vive en YerbasBM.Infrastructure, siguiendo el patrón Repository.
/// </summary>
public interface ICategoryRepository
{
    /// <summary>Devuelve todas las categorías ordenadas por nombre.</summary>
    Task<List<Category>> GetAllAsync();

    /// <summary>Busca una categoría por id. Devuelve null si no existe.</summary>
    Task<Category?> GetByIdAsync(Guid id);

    /// <summary>
    /// Indica si ya existe una categoría con ese slug. Si <paramref name="excludeId"/>
    /// se especifica, ignora esa categoría (usado al actualizar una categoría existente).
    /// </summary>
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null);

    /// <summary>Agrega una nueva categoría al contexto (no persiste hasta llamar a SaveChangesAsync).</summary>
    Task AddAsync(Category category);

    /// <summary>Marca una categoría para ser eliminada (no persiste hasta llamar a SaveChangesAsync).</summary>
    Task DeleteAsync(Category category);

    /// <summary>Persiste los cambios pendientes en la base de datos.</summary>
    Task SaveChangesAsync();
}
