using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YerbasBM.API.Requests;
using YerbasBM.Application.Common;
using YerbasBM.Application.DTOs;
using YerbasBM.Application.Interfaces;

namespace YerbasBM.API.Controllers;

/// <summary>
/// CRUD de productos del catálogo — ver sección 5/6 de CONTEXTO.md.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly IReadOnlyDictionary<string, string> ExtensionByContentType = new Dictionary<string, string>
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };

    private readonly IProductService _productService;
    private readonly IProductImageStorage _imageStorage;

    public ProductsController(IProductService productService, IProductImageStorage imageStorage)
    {
        _productService = productService;
        _imageStorage = imageStorage;
    }

    /// <summary>Lista los productos activos. Filtra por categoría si se pasa ?category={slug}.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll([FromQuery] string? category)
    {
        var products = await _productService.GetActiveAsync(category);
        return Ok(products);
    }

    /// <summary>Devuelve el detalle de un producto por id.</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    /// <summary>
    /// Crea un producto nuevo. Requiere sesión de admin. La imagen viaja como
    /// multipart/form-data y se sube a Supabase Storage antes de crear el registro
    /// (sección 9 de CONTEXTO.md).
    /// </summary>
    [Authorize]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ProductDto>> Create([FromForm] CreateProductFormRequest request)
    {
        var (imageUrl, error) = await UploadImageAsync(request.Image);
        if (error is not null)
        {
            return BadRequest(new { error });
        }

        var dto = new CreateProductDto
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            CategoryId = request.CategoryId,
            IsFeatured = request.IsFeatured,
            ImageUrl = imageUrl
        };

        var product = await _productService.CreateAsync(dto);
        return StatusCode(StatusCodes.Status201Created, product);
    }

    /// <summary>
    /// Actualiza un producto existente. Requiere sesión de admin. La imagen es
    /// opcional: si no se envía, se conserva la imagen actual del producto.
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, [FromForm] UpdateProductFormRequest request)
    {
        var existing = await _productService.GetByIdAsync(id);
        if (existing is null)
        {
            return NotFound();
        }

        var imageUrl = existing.ImageUrl;
        if (request.Image is not null)
        {
            var (uploadedUrl, error) = await UploadImageAsync(request.Image);
            if (error is not null)
            {
                return BadRequest(new { error });
            }

            imageUrl = uploadedUrl;
        }

        var dto = new UpdateProductDto
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            CategoryId = request.CategoryId,
            IsActive = request.IsActive,
            IsFeatured = request.IsFeatured,
            ImageUrl = imageUrl
        };

        var product = await _productService.UpdateAsync(id, dto);
        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    /// <summary>
    /// Valida y sube una imagen a Supabase Storage. Devuelve la URL pública en
    /// <c>Url</c>, o un mensaje en <c>Error</c> si la validación falló.
    /// </summary>
    private async Task<(string? Url, string? Error)> UploadImageAsync(IFormFile image)
    {
        if (!ExtensionByContentType.TryGetValue(image.ContentType, out var extension))
        {
            return (null, "Formato de imagen no permitido. Se acepta JPG, PNG o WebP.");
        }

        await using var stream = image.OpenReadStream();
        using var buffer = new MemoryStream();
        await stream.CopyToAsync(buffer);
        var content = buffer.ToArray();

        var validationError = ProductImageValidator.Validate(image.Length, image.ContentType, content);
        if (validationError is not null)
        {
            return (null, validationError);
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var url = await _imageStorage.UploadAsync(content, fileName, image.ContentType);
        return (url, null);
    }

    /// <summary>Elimina un producto. Requiere sesión de admin.</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _productService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
