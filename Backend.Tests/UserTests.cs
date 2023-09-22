using System.Runtime.CompilerServices;
using NUnit.Framework;
using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using greenBayAPI.Models;
using greenBayAPI.Data;
using Newtonsoft.Json;
using System.Text;
using Backend.Test;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.Extensions.Logging;

[assembly: InternalsVisibleTo("Backend.Tests")]

namespace Backend.Test;

public static class Utilities
{
    public static void InitializeDbForTests(ApplicationDbContext db)
    {
        db.Users.Add(new User
        {
            Username = "TestUser",
            Email = "testuser@example.com", 
            Password = BCrypt.Net.BCrypt.HashPassword("TestPassword123")
        });
        db.SaveChanges();
    } 
}

public class UserControllerTests
{
    private readonly HttpClient _client;

    public UserControllerTests(FactoryOverride factory)
    {
        _client = factory.CreateClient();
    }

    [Test]
    [Order(1)]
    public async Task TestCanRegisterUser()
    {
        var response = await _client.PostAsJsonAsync("/api/User/register", new RegisterDTO
        {
            Username = "NewUser",
            Email = "newuser@example.com",
            Password = "NewPassword123"
        });

        response.EnsureSuccessStatusCode();

        var returnedJson = await response.Content.ReadAsStringAsync();
        StringAssert.Contains("Registration successful", returnedJson);
    }
}
