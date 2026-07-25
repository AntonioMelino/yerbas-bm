using Microsoft.AspNetCore.Mvc;
using YerbasBM.Application.DTOs;
using YerbasBM.Application.Interfaces;

namespace YerbasBM.API.Controllers;

/// <summary>
/// CRUD de categorías de productos. Las categorías se crean dinámicamente
/// desde el panel admin (no son un enum fijo) — ver sección 5/6 de CONTEXTO.md.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>Lista todas las categorías.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);
    }

    /// <summary>Crea una categoría nueva. El slug se genera automáticamente a partir del nombre.</summary>
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);
        return StatusCode(StatusCodes.Status201Created, category);
    }

    /// <summary>Actualiza el nombre de una categoría existente.</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> Update(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        var category = await _categoryService.UpdateAsync(id, dto);
        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    /// <summary>Elimina una categoría.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _categoryService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
