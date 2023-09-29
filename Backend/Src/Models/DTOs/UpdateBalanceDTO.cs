using System.ComponentModel.DataAnnotations;

public class UpdateBalanceDTO
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int Amount { get; set; }
}
