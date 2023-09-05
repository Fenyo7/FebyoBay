using greenBayAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace greenBayAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the relationship between User and Item
            modelBuilder
                .Entity<User>()
                .HasMany(u => u.Items) // One user has many items
                .WithOne(i => i.User) // Each item is associated with one user
                .HasForeignKey(i => i.UserId); // Set the foreign key on Item

            base.OnModelCreating(modelBuilder);
        }

        // Seed the database with dummy data
        public void SeedData()
        {
            List<User> addedUsers = new List<User>();

            if (!Users.Any())
            {
                var user1 = new User
                {
                    Username = "JohnDoe",
                    Password = "password123",
                    Email = "john.doe@example.com",
                    Balance = 57400
                };

                var user2 = new User
                {
                    Username = "JaneSmith",
                    Password = "password456",
                    Email = "jane.smith@example.com",
                    Balance = 142000
                };

                Users.AddRange(user1, user2);
                SaveChanges();

                addedUsers.Add(user1);
                addedUsers.Add(user2);
            }

            if (!Items.Any())
            {
                Items.AddRange(
                    new Item
                    {
                        UserId = addedUsers[0].Id,
                        Name = "Laptop",
                        Price = 250000,
                        Description = "A high-end laptop",
                        ImageLink = "Dummylink.com"
                    },
                    new Item
                    {
                        UserId = addedUsers[1].Id,
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
