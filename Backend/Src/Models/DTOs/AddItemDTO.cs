using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using greenBayAPI.Models;
namespace DTOs;

public class AddItemDTO
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string ImageLink { get; set; }
}
