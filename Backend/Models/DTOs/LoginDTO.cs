using System.ComponentModel.DataAnnotations;

public class LoginDTO
{
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }
}
