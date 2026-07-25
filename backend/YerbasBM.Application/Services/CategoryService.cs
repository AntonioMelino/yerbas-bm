using YerbasBM.Application.Common;
using YerbasBM.Application.DTOs;
using YerbasBM.Application.Interfaces;
using YerbasBM.Domain.Entities;

namespace YerbasBM.Application.Services;

/// <summary>
/// Implementación de <see cref="ICategoryService"/>: valida, genera slugs únicos
/// y traduce entre <see cref="Category"/> (dominio) y los DTOs expuestos por la API.
/// </summary>
public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetByIdAsync(Guid id)
    {
        var category = await _repository.GetByIdAsync(id);
        return category is null ? null : MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var name = dto.Name.Trim();
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = name,
            Slug = await GenerateUniqueSlugAsync(name),
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(category);
        await _repository.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<CategoryDto?> UpdateAsync(Guid id, UpdateCategoryDto dto)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category is null)
        {
            return null;
        }

        var name = dto.Name.Trim();
        if (!string.Equals(category.Name, name, StringComparison.Ordinal))
        {
            category.Name = name;
            category.Slug = await GenerateUniqueSlugAsync(name, id);
        }

        await _repository.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category is null)
        {
            return false;
        }

        await _repository.DeleteAsync(category);
        await _repository.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Genera un slug a partir del nombre y le agrega un sufijo numérico ("-2", "-3", ...)
    /// si ya existe otra categoría con el mismo slug.
    /// </summary>
    private async Task<string> GenerateUniqueSlugAsync(string name, Guid? excludeId = null)
    {
        var baseSlug = SlugGenerator.Generate(name);
        var slug = baseSlug;
        var suffix = 2;

        while (await _repository.SlugExistsAsync(slug, excludeId))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }

        return slug;
    }

    private static CategoryDto MapToDto(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Slug = category.Slug
    };
}
