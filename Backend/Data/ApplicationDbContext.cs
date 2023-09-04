using greenBayAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace greenBayAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }

        // Seed the database with dummy data
        public void SeedData()
        {
            if (!Users.Any())
            {
                Users.AddRange(
                    new User
                    {
                        Username = "JohnDoe",
                        Password = "password123",
                        Email = "john.doe@example.com"
                    },
                    new User
                    {
                        Username = "JaneSmith",
                        Password = "password456",
                        Email = "jane.smith@example.com"
                    }
                );
            }

            if (!Items.Any())
            {
                Items.AddRange(
                    new Item
                    {
                        UserId = 1,
                        Name = "Laptop",
                        Price = 250000,
                        Description = "A high-end laptop",
                        ImageLink = "Dummylink.com"
                    },
                    new Item
                    {
                        UserId = 2,
                        Name = "Mobile Phone",
                        Price = 80000,
                        Description = "A latest model mobile phone",
                        ImageLink = "Dummylink2.com"
                    }
                );
            }

            SaveChanges();
        }
    }
}
