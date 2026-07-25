using Microsoft.EntityFrameworkCore;
using YerbasBM.Application.Interfaces;
using YerbasBM.Domain.Entities;
using YerbasBM.Infrastructure.Data;

namespace YerbasBM.Infrastructure.Repositories;

/// <summary>
/// Implementación de <see cref="IProductRepository"/> usando Entity Framework Core
/// contra <see cref="YerbasBMDbContext"/>.
/// </summary>
public class ProductRepository : IProductRepository
{
    private readonly YerbasBMDbContext _context;

    public ProductRepository(YerbasBMDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetActiveAsync(string? categorySlug = null)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(categorySlug))
        {
            query = query.Where(p => p.Category != null && p.Category.Slug == categorySlug);
        }

        return await query.OrderBy(p => p.Name).ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id) =>
        await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

    public async Task AddAsync(Product product) =>
        await _context.Products.AddAsync(product);

    public Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}
