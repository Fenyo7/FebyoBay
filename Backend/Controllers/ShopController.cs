using greenBayAPI.Data;
using greenBayAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ShopController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public ShopController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("addItem")]
    public async Task<IActionResult> AddItem(AddItemDTO itemDto)
    {
        var item = new Item
        {
            UserId = itemDto.UserId,
            Name = itemDto.Name,
            Price = itemDto.Price,
            Description = itemDto.Description,
            ImageLink = itemDto.ImageLink
        };
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetAllItems()
    {
        var items = await _context.Items.Where(i => !i.IsSold).ToListAsync();
        return Ok(items);
    }

    [HttpGet("item/{id}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
        {
            return NotFound("Item not found");
        }
        return Ok(item);
    }

    [HttpPost("buy/{id}")]
    public async Task<IActionResult> BuyItem(int id)
    {
        var item = await _context.Items.FindAsync(id);

        if (item == null)
        {
            return NotFound("Item not found");
        }

        if (item.IsSold)
        {
            return BadRequest("Item is already sold");
        }

        item.IsSold = true;

        _context.Update(item);
        await _context.SaveChangesAsync();

        return Ok(item);
    }
}
