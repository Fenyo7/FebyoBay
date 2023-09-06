using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace greenBayAPI.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public string Description { get; set; }

        [Required]
        public string ImageLink { get; set; }

        [Required]
        public bool IsSold { get; set; } = false;
    }
}
