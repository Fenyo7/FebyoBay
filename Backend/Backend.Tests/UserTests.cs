using System.Net.Http.Json;
using greenBayAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using test;

namespace Backend.Test
{
    [TestFixture]
    public class UserControllerTests
    {
        private FactoryOverride _factory;
        private ApplicationDbContext _context;

        [SetUp]
        public void Setup()
        {
            _factory = new FactoryOverride();
            using var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _context.Database.Migrate(); // Ensure migrations are applied
        }

        [Test]
        [Order(1)]
        public async Task TestCanRegisterUser()
        {
            var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _context.Database.EnsureCreated();

            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync(
                "/api/User/register",
                new RegisterDTO
                {
                    Username = "NewUser",
                    Email = "newuser@example.com",
                    Password = "NewPassword123"
                }
            );

            response.EnsureSuccessStatusCode();

            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Registration successful", returnedJson);
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
