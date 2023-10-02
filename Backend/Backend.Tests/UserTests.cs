using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DTOs;
using greenBayAPI.Data;
using greenBayAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Backend.Test
{
    [TestFixture]
    public class UserControllerTests
    {
        private FactoryOverride _factory;
        private ApplicationDbContext _context;
        private string? _authToken;

        public UserControllerTests()
        {
            _factory = new FactoryOverride();
            var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
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

        [SetUp]
        public void Setup()
        {
            _factory = new FactoryOverride();
            using var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _context.Database.EnsureCreated();
            _context.Database.Migrate();

            SeedDatabase();
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
                    Username = "TestUser",
                    Email = "testuser@example.com",
                    Password = "TestPassword123"
                }
            );

            response.EnsureSuccessStatusCode();

            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("Registration successful", returnedJson);
        }

        [Test]
        [Order(2)]
        public async Task TestLoginWithValidCredentials()
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
        [Order(3)]
        public async Task TestLoginWithInvalidName()
        {
            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync(
                "/api/User/login",
                new LoginDTO
                {
                    Username = "CertainlyNotAnExistingUsernameRight?",
                    Password = "NewPassword123"
                }
            );
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Test]
        [Order(4)]
        public async Task TestLoginWithInvalidPassword()
        {
            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync(
                "/api/User/login",
                new LoginDTO { Username = "NewUser", Password = "WrongPassword" }
            );
            Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Test]
        [Order(5)]
        public async Task TestGetAllUsers()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/User/users");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("NewUser", returnedJson);
        }

        [Test]
        [Order(6)]
        public async Task TestGetUserByIdValid()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/User/user/1");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("JohnDoe", returnedJson);
        }

        [Test]
        [Order(7)]
        public async Task TestGetUserByIdInvalid()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/User/user/999999");
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Test]
        [Order(8)]
        public async Task TestUpdateUsername()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PutAsJsonAsync(
                "/api/User/updateUsername",
                new UpdateUsernameDTO
                {
                    Id = 1,
                    Username = "UpdatedUsername"
                }
            );
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("User updated successfully", returnedJson);
        }

        [Test]
        [Order(9)]
        public async Task TestUpdateEmail()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PutAsJsonAsync(
                "/api/User/updateEmail",
                new UpdateEmailDTO
                {
                    Id = 1,
                    Email = "updated@example.com"
                }
            );
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("User updated successfully", returnedJson);
        }

        [Test]
        [Order(10)]
        public async Task TestDeleteUser()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.DeleteAsync("/api/User/delete/1");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("User deleted successfully", returnedJson);
        }

        [Test]
        [Order(11)]
        public async Task TestGetBalanceById()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.GetAsync("/api/User/balance/1");
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
        }

        [Test]
        [Order(12)]
        public async Task TestUpdateBalancePositive()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PutAsJsonAsync(
                "/api/User/updateBalance",
                new UpdateBalanceDTO
                {
                    UserId = 1,
                    Amount = 100
                }
            );
            response.EnsureSuccessStatusCode();
            var returnedJson = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("User's balance updated successfully", returnedJson);
        }

        [Test]
        [Order(13)]
        public async Task TestUpdateBalanceNegative()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);

            var response = await client.PutAsJsonAsync(
                "/api/User/updateBalance",
                new UpdateBalanceDTO
                {
                    UserId = 1,
                    Amount = -1000000000
                }
            );
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
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

    internal class TokenResponse
    {
        public string? token { get; set; }
    }
}
