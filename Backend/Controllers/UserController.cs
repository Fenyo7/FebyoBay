using Microsoft.AspNetCore.Mvc;
using greenBayAPI.Models;
using greenBayAPI.Data;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public UserController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO registerDto)
    {
        try
        {
            // Check if the username already exists
            var usernameExists = await _context.Users.AnyAsync(
                u => u.Username == registerDto.Username
            );
            if (usernameExists)
                return BadRequest("Username is taken");

            // Check if the email already exists
            var emailExists = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);
            if (emailExists)
                return BadRequest("Email is already registered");

            // Create the new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful" });
        }
        catch (Exception ex)
        {
            return BadRequest(
                new { Message = "An error occurred during registration.", Details = ex.Message }
            );
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO loginDto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(
                u => u.Username == loginDto.Username
            );
            if (user == null)
                return NotFound("User not found");
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized("Wrong password");

            // Generate JWT and return it
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(
                new { Message = "An error occurred during login.", Details = ex.Message }
            );
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }
        return Ok(user);
    }

    [HttpPut("updateUsername")]
    public async Task<IActionResult> UpdateUsername(UpdateUsernameDTO updateUsernameDTO)
    {
        var user = await _context.Users.FindAsync(updateUsernameDTO.Id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        user.Username = updateUsernameDTO.Username;

        await _context.SaveChangesAsync();

        return Ok(new { Message = "User updated successfully" });
    }

    [HttpPut("updateEmail")]
    public async Task<IActionResult> UpdateEmail(UpdateEmailDTO updateEmailDTO)
    {
        var user = await _context.Users.FindAsync(updateEmailDTO.Id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        user.Email = updateEmailDTO.Email;

        await _context.SaveChangesAsync();

        return Ok(new { Message = "User updated successfully" });
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User deleted successfully" });
    }

    [HttpGet("balance/{id}")]
    public async Task<IActionResult> GetBalanceById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }
        return Ok(user.Balance);
    }

    [HttpPut("updateBalance")]
    public async Task<IActionResult> UpdateBalance(UpdateBalanceDTO updateBalanceDTO)
    {
        var user = await _context.Users.FindAsync(updateBalanceDTO.UserId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        if(user.Balance + updateBalanceDTO.Amount < 0){
            return BadRequest("User doesn't have enough credit");
        } else {
            user.Balance += updateBalanceDTO.Amount;
        }

        await _context.SaveChangesAsync();

        return Ok(new { Message = "User's balance updated successfully" });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(30), // Token expiration, adjust as needed
            SigningCredentials = creds,
            Issuer = _config["JwtSettings:Issuer"],
            Audience = _config["JwtSettings:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
