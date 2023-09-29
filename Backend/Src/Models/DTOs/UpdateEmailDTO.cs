using System.ComponentModel.DataAnnotations;

public class UpdateEmailDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Email { get; set; }
}
