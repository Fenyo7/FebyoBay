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
            else 
            {
                addedUsers = Users.ToList();
            }

            if (!Items.Any())
            {
                var itemsData = new List<(
                    string Name,
                    string Description,
                    string ImageLink,
                    decimal Price
                )>
                {
                    (
                        "Laptop",
                        "A high-end laptop",
                        "https://unsplash.com/photos/8pb7Hq539Zw",
                        250000
                    ),
                    (
                        "Mobile Phone",
                        "Latest model mobile phone",
                        "https://unsplash.com/photos/2x19-mRQgX8",
                        80000
                    ),
                    (
                        "Vacuum Cleaner",
                        "Powerful vacuum cleaner",
                        "https://unsplash.com/photos/1K9T5YiZ2WU",
                        50000
                    ),
                    (
                        "Boat",
                        "Luxury boat for sailing",
                        "https://unsplash.com/photos/8xM5bPbpBI4",
                        5000000
                    ),
                    (
                        "Camera",
                        "DSLR camera with high resolution",
                        "https://unsplash.com/photos/6a6ym0j_lax",
                        150000
                    ),
                    (
                        "Wrist Watch",
                        "Elegant wrist watch",
                        "https://unsplash.com/photos/Mv7KkJ04NLg",
                        20000
                    ),
                    (   "Bicycle", 
                        "Mountain bike", 
                        "https://unsplash.com/photos/7ZphwmJYNSg", 
                        45000
                    ),
                    (
                        "Television",
                        "50-inch 4K UHD TV",
                        "https://unsplash.com/photos/KuCGlBXjH_o",
                        300000
                    ),
                    (
                        "Refrigerator",
                        "Double door refrigerator",
                        "https://unsplash.com/photos/R8594j3ZLE8",
                        120000
                    ),
                    (
                        "Microwave Oven",
                        "Convection microwave oven",
                        "https://unsplash.com/photos/6ed2QJT4M1I",
                        40000
                    ),
                    (
                        "Sofa",
                        "Comfortable 3-seater sofa",
                        "https://unsplash.com/photos/213ukYSJ6ho",
                        75000
                    ),
                    (   "Guitar", 
                        "Acoustic guitar", 
                        "https://unsplash.com/photos/_6HzPU9Hyfg", 
                        18000
                    ),
                    (
                        "Sneakers",
                        "Running sneakers",
                        "https://unsplash.com/photos/8BmNurlVR6M",
                        12000
                    ),
                    (
                        "Sunglasses",
                        "UV protected sunglasses",
                        "https://unsplash.com/photos/_AcUSNQh_go",
                        5000
                    ),
                    (
                        "Backpack",
                        "Travel backpack",
                        "https://unsplash.com/photos/Mf23RF8xArY",
                        15000
                    )
                };

                foreach (var itemData in itemsData)
                {
                    Items.Add(
                        new Item
                        {
                            UserId = addedUsers[new Random().Next(0, 2)].Id, // Randomly assign a user
                            Name = itemData.Name,
                            Price = itemData.Price,
                            Description = itemData.Description,
                            ImageLink = itemData.ImageLink
                        }
                    );
                }

                SaveChanges();
            }
        }
    }
}
