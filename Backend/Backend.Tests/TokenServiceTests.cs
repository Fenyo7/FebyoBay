using Moq;
using NUnit.Framework;
using Microsoft.Extensions.Configuration;
using greenBayAPI.Services;
using greenBayAPI.Models;
using System.Threading.RateLimiting; // Replace with the namespace of your TokenService

[TestFixture]
public class TokenServiceTests
{
    private TokenService? _tokenService;
    private Mock<IConfiguration>? _mockConfig;

    [SetUp]
    public void Setup()
    {
        _mockConfig = new Mock<IConfiguration>();

        // Mocking the configuration values for JwtSettings
        _mockConfig
            .SetupGet(m => m["JwtSettings:Key"])
            .Returns(
                "ThisIsASampleKeyForJwtTokenGenerationWhichIs64CharsHereAreSomeMoreRandomCharactersAsWell"
            );
        _mockConfig.SetupGet(m => m["JwtSettings:Issuer"]).Returns("YourIssuerHere");
        _mockConfig.SetupGet(m => m["JwtSettings:Audience"]).Returns("YourAudienceHere");

        _tokenService = new TokenService(_mockConfig.Object);
    }

    [Test]
    [Order(1)]
    public void GenerateJwtToken_ValidUser_ReturnsToken()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Username = "testUser",
            Password = "testPassword1234",
            Email = "test@email.com"
        };

        // Act
        var token = _tokenService?.GenerateJwtToken(user);

        // Assert
        Assert.IsNotNull(token);
        Assert.IsInstanceOf<string>(token);
    }

    [Test]
    [Order(2)]
    public void GenerateJwtToken_NullUser_ThrowsArgumentNullException()
    {
        // Arrange
        User? nullUser = null;

        // Act & Assert
        Assert.Throws<NullReferenceException>(() => _tokenService?.GenerateJwtToken(nullUser));
    }

    [Test]
    [Order(3)]
    public void GenerateJwtToken_InvalidKeySize_ThrowsArgumentOutOfRangeException()
    {
        // Arrange
        var user = new User { Id = 1, Username = "testUser" };

        // Mocking an invalid key size
        _mockConfig?.SetupGet(m => m["JwtSettings:Key"]).Returns("ShortKey");

        // Act & Assert
        Assert.Throws<ArgumentOutOfRangeException>(() => _tokenService?.GenerateJwtToken(user));
    }
}
