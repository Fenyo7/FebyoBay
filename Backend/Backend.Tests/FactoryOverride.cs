using System.Data.Common;
using greenBayAPI.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace test;

public class FactoryOverride : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                     typeof(DbContextOptions<ApplicationDbContext>));
            if (dbContextDescriptor != null) { services.Remove(dbContextDescriptor); }

            var dbConnectionDescriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                     typeof(DbConnection));
            if (dbContextDescriptor != null) { services.Remove(dbContextDescriptor); }

            services.AddSingleton<DbConnection>(container =>
            {
                var connection = new SqliteConnection("DataSource=:memory:");
                connection.Open();
                return connection;
            });

            services.AddDbContext<ApplicationDbContext>((container, options) =>
            {
                var connection = container.GetRequiredService<DbConnection>();
                options.UseSqlite(connection);
            });

            using var scope = services.BuildServiceProvider().CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate(); // Ensure migrations are applied
        });

        builder.UseEnvironment("Development");
    }
}
