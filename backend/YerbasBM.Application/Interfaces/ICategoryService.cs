using YerbasBM.Application.DTOs;

namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Lógica de negocio de categorías: expone DTOs a los controllers y coordina
/// el acceso a datos a través de <see cref="ICategoryRepository"/>.
/// </summary>
public interface ICategoryService
{
    /// <summary>Devuelve todas las categorías.</summary>
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    /// <summary>Busca una categoría por id. Devuelve null si no existe.</summary>
    Task<CategoryDto?> GetByIdAsync(Guid id);

    /// <summary>Crea una categoría nueva generando un slug único a partir del nombre.</summary>
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);

    /// <summary>
    /// Actualiza el nombre de una categoría existente. Devuelve null si la categoría no existe.
    /// Si el nombre cambia, regenera el slug.
    /// </summary>
    Task<CategoryDto?> UpdateAsync(Guid id, UpdateCategoryDto dto);

    /// <summary>Elimina una categoría. Devuelve false si no existía.</summary>
    Task<bool> DeleteAsync(Guid id);
}
