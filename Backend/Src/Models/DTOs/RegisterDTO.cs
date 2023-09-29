using System.ComponentModel.DataAnnotations;

public class RegisterDTO
{
    [Required]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; }
}
