using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DTOs;
using greenBayAPI.Data;
using greenBayAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using test;

namespace Backend.Test
{
    [TestFixture]
    public class ShopControllerTests
    {
        private FactoryOverride _factory;
        private ApplicationDbContext _context;
        private string? _authToken;

        public ShopControllerTests()
        {
            _factory = new FactoryOverride();
            var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        }

        [SetUp]
        public void Setup()
        {
            _factory = new FactoryOverride();
            using var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _context.Database.Migrate(); 

            SeedDatabase();
        }

        public void SeedDatabase()
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == "NewUser");
            if (existingUser == null)
            {
                var user = new User
                {
                    Username = "NewUser",
                    Email = "newuser@example.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("NewPassword123"),
                    Balance = 0
                };
                _context.Users.Add(user);
                _context.SaveChanges();
            }
        }

        private async Task GetToken()
        {
            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync(
                "/api/User/login",
                new LoginDTO { Username = "NewUser", Password = "NewPassword123" }
            );
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("token", returnedJson);

            var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(returnedJson);
            if (tokenResponse != null)
            {
                _authToken = tokenResponse.token;
            }
            else
            {
                Assert.Fail("Token response is null.");
            }
        }

        [Test]
        [Order(1)]
        public async Task TestAddItem()
        {
            await GetToken();

            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PostAsJsonAsync(
                "/api/Shop/addItem",
                new AddItemDTO
                {
                    UserId = 1,
                    Name = "Test Item",
                    Price = 5000,
                    Description = "This is the test item's description",
                    ImageLink =
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVEmuTxqtgm4nVZ1-HObvT6apOQ7j3mJe1Q&usqp=CAU"
                }
            );

            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [Test]
        [Order(2)]
        public async Task TestGetAllItems()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/Shop/items");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [Test]
        [Order(3)]
        public async Task TestGetItemById()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/Shop/item/1"); // Assuming the item ID is 1 for the added item
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Laptop", returnedJson);
        }

        [Test]
        [Order(4)]
        public async Task TestBuyItem()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PostAsJsonAsync("/api/Shop/buy/1", 1); // Assuming the item ID is 1
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Laptop", returnedJson);
        }

        [Test]
        [Order(5)]
        public async Task TestEditItem()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PutAsJsonAsync(
                "/api/Shop/item/1",
                new AddItemDTO
                {
                    Name = "Updated Test Item",
                    Price = 6000,
                    Description = "Updated description",
                    ImageLink = "https://newimagelink.com"
                }
            );

            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Item updated successfully", returnedJson);
        }

        [Test]
        [Order(6)]
        public async Task TestDeleteItem()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.DeleteAsync("/api/Shop/item/1");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Item deleted successfully", returnedJson);
        }

        [Test]
        [Order(7)]
        public async Task TestDeleteItemwithInvalidId()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.DeleteAsync("/api/Shop/item/9999");
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }

        [TearDown]
        public void TearDown()
        {
            try
            {
                _context.Database.EnsureDeleted();
            }
            catch (ObjectDisposedException)
            {
                Console.WriteLine("error");
            }
            finally
            {
                _factory.Dispose();
            }
        }
    }
}
