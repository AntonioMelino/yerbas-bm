using Microsoft.EntityFrameworkCore;
using YerbasBM.Domain.Entities;

namespace YerbasBM.Infrastructure.Data;

/// <summary>
/// Contexto de Entity Framework Core para la base de datos PostgreSQL (Supabase).
/// Mapea las entidades del dominio a las tablas definidas en la sección 5 de CONTEXTO.md.
/// </summary>
public class YerbasBMDbContext : DbContext
{
    public YerbasBMDbContext(DbContextOptions<YerbasBMDbContext> options) : base(options)
    {
    }

    /// <summary>Tabla de categorías de productos.</summary>
    public DbSet<Category> Categories => Set<Category>();

    /// <summary>Tabla de productos del catálogo.</summary>
    public DbSet<Product> Products => Set<Product>();

    /// <summary>Tabla del usuario administrador.</summary>
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    /// <summary>
    /// Configura el mapeo de entidades a tablas: nombres de tabla/columna en snake_case
    /// para que coincidan exactamente con el esquema SQL ya definido en Supabase.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(c => c.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            entity.Property(c => c.Slug).HasColumnName("slug").HasMaxLength(100).IsRequired();
            entity.HasIndex(c => c.Slug).IsUnique();
            entity.Property(c => c.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(p => p.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
            entity.Property(p => p.Description).HasColumnName("description");
            entity.Property(p => p.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            entity.Property(p => p.Stock).HasColumnName("stock").HasDefaultValue(0);
            entity.Property(p => p.ImageUrl).HasColumnName("image_url");
            entity.Property(p => p.CategoryId).HasColumnName("category_id");
            entity.Property(p => p.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(p => p.IsFeatured).HasColumnName("is_featured").HasDefaultValue(false);
            entity.Property(p => p.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
            entity.Property(p => p.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("now()");

            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("admin_users");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(a => a.Username).HasColumnName("username").HasMaxLength(50).IsRequired();
            entity.HasIndex(a => a.Username).IsUnique();
            entity.Property(a => a.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entity.Property(a => a.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
        });
    }
}
