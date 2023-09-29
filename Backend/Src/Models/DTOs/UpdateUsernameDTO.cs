using System.ComponentModel.DataAnnotations;

public class UpdateUsernameDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }
}
