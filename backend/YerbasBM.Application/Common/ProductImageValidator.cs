namespace YerbasBM.Application.Common;

/// <summary>
/// Reglas de validación para las imágenes de producto subidas a Supabase Storage
/// (límites acordados: 2 MB, JPG/PNG/WebP — ver sección 9 de CONTEXTO.md).
/// </summary>
public static class ProductImageValidator
{
    public const long MaxSizeBytes = 2 * 1024 * 1024;

    private static readonly IReadOnlyDictionary<string, byte[][]> SignaturesByContentType = new Dictionary<string, byte[][]>
    {
        ["image/jpeg"] = [[0xFF, 0xD8, 0xFF]],
        ["image/png"] = [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
        // WebP: "RIFF" en los primeros 4 bytes, "WEBP" en los bytes 8-11 (se valida por separado).
        ["image/webp"] = [[0x52, 0x49, 0x46, 0x46]]
    };

    /// <summary>
    /// Valida tamaño, content-type declarado y los primeros bytes del archivo (magic bytes),
    /// para no confiar ciegamente en el Content-Type que manda el cliente.
    /// Devuelve un mensaje de error, o null si el archivo es válido.
    /// </summary>
    public static string? Validate(long length, string? contentType, byte[] content)
    {
        if (length <= 0)
        {
            return "El archivo de imagen está vacío.";
        }

        if (length > MaxSizeBytes)
        {
            return $"La imagen supera el tamaño máximo permitido ({MaxSizeBytes / (1024 * 1024)} MB).";
        }

        if (contentType is null || !SignaturesByContentType.TryGetValue(contentType, out var signatures))
        {
            return "Formato de imagen no permitido. Se acepta JPG, PNG o WebP.";
        }

        var matchesSignature = signatures.Any(signature =>
            content.Length >= signature.Length && content.Take(signature.Length).SequenceEqual(signature));

        if (!matchesSignature)
        {
            return "El contenido del archivo no coincide con el formato declarado.";
        }

        if (contentType == "image/webp" && !(content.Length >= 12 &&
            content[8] == 0x57 && content[9] == 0x45 && content[10] == 0x42 && content[11] == 0x50))
        {
            return "El contenido del archivo no coincide con el formato declarado.";
        }

        return null;
    }
}
