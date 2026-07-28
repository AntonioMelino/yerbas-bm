using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using YerbasBM.Application.Interfaces;

namespace YerbasBM.Infrastructure.Services;

/// <summary>
/// Sube imágenes de producto al bucket público "product-images" de Supabase Storage
/// usando la Storage REST API directamente (sin el SDK completo — solo necesitamos
/// subir un archivo). Ver sección 9 de CONTEXTO.md.
/// </summary>
public class SupabaseProductImageStorage : IProductImageStorage
{
    private const string BucketName = "product-images";

    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public SupabaseProductImageStorage(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> UploadAsync(byte[] content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var supabaseUrl = _configuration["Supabase:Url"];
        var serviceKey = _configuration["Supabase:ServiceKey"];
        if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(serviceKey))
        {
            // Falla recién acá (no al construir el servicio) para no romper endpoints de
            // Products que no suben imágenes si Supabase Storage no está configurado.
            throw new InvalidOperationException(
                "Supabase:Url y Supabase:ServiceKey deben estar configurados (user-secrets o variables de entorno) para subir imágenes.");
        }

        // El dashboard de Supabase muestra varias URLs parecidas (Project URL, REST API
        // URL, etc.) — si alguien pegó por error la de REST API (".../rest/v1"), la
        // normalizamos acá para no romper el path del Storage API.
        var baseUrl = supabaseUrl.TrimEnd('/');
        if (baseUrl.EndsWith("/rest/v1", StringComparison.OrdinalIgnoreCase))
        {
            baseUrl = baseUrl[..^"/rest/v1".Length];
        }

        var uploadUrl = $"{baseUrl}/storage/v1/object/{BucketName}/{fileName}";

        using var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
        request.Headers.Add("apikey", serviceKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);
        request.Content = new ByteArrayContent(content);
        request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"No se pudo subir la imagen a Supabase Storage ({(int)response.StatusCode}): {body}");
        }

        return $"{baseUrl}/storage/v1/object/public/{BucketName}/{fileName}";
    }
}
