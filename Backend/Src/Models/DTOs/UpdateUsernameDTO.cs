using System.ComponentModel.DataAnnotations;
namespace DTOs;
public class UpdateUsernameDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }
}
