using Microsoft.EntityFrameworkCore;
using YerbasBM.Application.Interfaces;
using YerbasBM.Domain.Entities;
using YerbasBM.Infrastructure.Data;

namespace YerbasBM.Infrastructure.Repositories;

/// <summary>
/// Implementación de <see cref="ICategoryRepository"/> usando Entity Framework Core
/// contra <see cref="YerbasBMDbContext"/>.
/// </summary>
public class CategoryRepository : ICategoryRepository
{
    private readonly YerbasBMDbContext _context;

    public CategoryRepository(YerbasBMDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync() =>
        await _context.Categories.AsNoTracking().OrderBy(c => c.Name).ToListAsync();

    public async Task<Category?> GetByIdAsync(Guid id) =>
        await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null) =>
        await _context.Categories.AnyAsync(c => c.Slug == slug && (!excludeId.HasValue || c.Id != excludeId.Value));

    public async Task AddAsync(Category category) =>
        await _context.Categories.AddAsync(category);

    public Task DeleteAsync(Category category)
    {
        _context.Categories.Remove(category);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}
