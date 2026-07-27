namespace YerbasBM.Application.Interfaces;

/// <summary>
/// Sube imágenes de productos a un storage externo (Supabase Storage) y
/// devuelve la URL pública resultante — ver sección 9 de CONTEXTO.md.
/// </summary>
public interface IProductImageStorage
{
    /// <summary>
    /// Sube el contenido a un archivo nuevo (nombre único) y devuelve su URL pública.
    /// </summary>
    Task<string> UploadAsync(byte[] content, string fileName, string contentType, CancellationToken cancellationToken = default);
}
