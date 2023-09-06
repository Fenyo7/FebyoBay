
using greenBayAPI.Data;
using Microsoft.AspNetCore.Mvc;

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
}