using Microsoft.EntityFrameworkCore;
using YerbasBM.Application.Interfaces;
using YerbasBM.Domain.Entities;
using YerbasBM.Infrastructure.Data;

namespace YerbasBM.Infrastructure.Repositories;

/// <summary>
/// Implementación de <see cref="IAdminUserRepository"/> usando Entity Framework Core
/// contra <see cref="YerbasBMDbContext"/>.
/// </summary>
public class AdminUserRepository : IAdminUserRepository
{
    private readonly YerbasBMDbContext _context;

    public AdminUserRepository(YerbasBMDbContext context)
    {
        _context = context;
    }

    public async Task<AdminUser?> GetByUsernameAsync(string username) =>
        await _context.AdminUsers.AsNoTracking().FirstOrDefaultAsync(a => a.Username == username);
}
