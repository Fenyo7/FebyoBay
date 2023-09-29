using System.ComponentModel.DataAnnotations;
namespace DTOs;

public class UpdateBalanceDTO
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int Amount { get; set; }
}
