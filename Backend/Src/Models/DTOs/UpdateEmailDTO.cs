using System.ComponentModel.DataAnnotations;
namespace DTOs;

public class UpdateEmailDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Email { get; set; }
}
