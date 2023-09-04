using System.ComponentModel.DataAnnotations;

namespace greenBayAPI.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public string Description { get; set; }
    }
}
