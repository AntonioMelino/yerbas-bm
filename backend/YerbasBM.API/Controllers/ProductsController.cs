using Microsoft.AspNetCore.Mvc;
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
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
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

    /// <summary>Crea un producto nuevo.</summary>
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return StatusCode(StatusCodes.Status201Created, product);
    }

    /// <summary>Actualiza un producto existente.</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    /// <summary>Elimina un producto.</summary>
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
