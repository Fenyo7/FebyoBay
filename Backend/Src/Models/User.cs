using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace greenBayAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        [Required]
        public string Email { get; set; }

        public decimal Balance { get; set; } = 0;

        // Navigation property
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
