using Microsoft.IdentityModel.Tokens;
using greenBayAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using greenBayAPI.Services;
using System; // Add this for Environment

[assembly: InternalsVisibleTo("Backend.Tests")]

public partial class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Register the ApplicationDbContext
        string defaultConnection =
            Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection")
            ?? builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<ApplicationDbContext>(
            options => options.UseNpgsql(defaultConnection)
        );

        // Register the TokenService
        builder.Services.AddScoped<TokenService>();

        // JWT Authentication
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        string jwtKey = Environment.GetEnvironmentVariable("JwtSettings:Key") ?? jwtSettings["Key"];
        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };

                // Handle authentication failures
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.NoResult();
                        context.Response.StatusCode = 401; // Unauthorized
                        context.Response.ContentType = "text/plain";
                        return context.Response.WriteAsync("Invalid token provided.");
                    },
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = 401; // Unauthorized
                        context.Response.ContentType = "text/plain";
                        return context.Response.WriteAsync(
                            "You need to provide a valid token to access this."
                        );
                    }
                };
            });

        // Add CORS services
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowAllOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                }
            );
        });

        // Add other services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Filling database with dummy data if it's empty

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
            context.SeedData();
        }

        app.UseHttpsRedirection();

        // Use CORS policy before Authentication and Authorization
        app.UseCors("AllowAllOrigins");

        var port = Environment.GetEnvironmentVariable("PORT") ?? "5001";
        builder.WebHost.UseUrls($"http://*:{port}");

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
