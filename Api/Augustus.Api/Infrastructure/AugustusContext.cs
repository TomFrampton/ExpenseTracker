using Augustus.Api.Infrastructure.Configuration;
using Augustus.Api.Models.Transactions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Augustus.Api.Infrastructure
{
    public class AugustusContext : DbContext
    {
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionCategory> TransactionCategories { get; set; }

        public AugustusContext(DbContextOptions<AugustusContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new TransactionConfiguration());
            modelBuilder.ApplyConfiguration(new TransactionCategoryConfiguration());

            // When EF Core 6 comes out change this code
            // https://devblogs.microsoft.com/dotnet/announcing-entity-framework-core-6-0-preview-6-configure-conventions/
            var decimalProperties = modelBuilder.Model.GetEntityTypes()
                .SelectMany(x => x.GetProperties())
                .Where(x => x.ClrType == typeof(decimal) || x.ClrType == typeof(decimal?));

            foreach (var property in decimalProperties)
            {
                property.SetPrecision(18);
                property.SetScale(6);
            }

            modelBuilder.Entity<TransactionCategory>().HasData(
                new TransactionCategory { Id = 1, Name = "Groceries" },
                new TransactionCategory { Id = 2, Name = "Amazon" },
                new TransactionCategory { Id = 3, Name = "Eat Out" },
                    new TransactionCategory { Id = 301, Name = "Restaurant", ParentId = 3 },
                    new TransactionCategory { Id = 302, Name = "Pub", ParentId = 3 },
                    new TransactionCategory { Id = 303, Name = "Fast-Food", ParentId = 3 },
                new TransactionCategory { Id = 4, Name = "Utility Bills" },
                    new TransactionCategory { Id = 401, Name = "Water", ParentId = 4 },
                    new TransactionCategory { Id = 402, Name = "Electricity", ParentId = 4 },
                new TransactionCategory { Id = 5, Name = "Council Tax" },
                new TransactionCategory { Id = 6, Name = "Travel" },
                    new TransactionCategory { Id = 601, Name = "Commute", ParentId = 6 },
                    new TransactionCategory { Id = 602, Name = "Flight", ParentId = 6 },
                new TransactionCategory { Id = 7, Name = "Mortgage" },
                new TransactionCategory { Id = 8, Name = "Takeaway" },
                new TransactionCategory { Id = 9, Name = "Holidays" },
                    new TransactionCategory { Id = 901, Name = "Hotel", ParentId = 9 },
                    new TransactionCategory { Id = 902, Name = "Flights", ParentId = 9 },
                    new TransactionCategory { Id = 903, Name = "Souvenirs", ParentId = 9 },
                new TransactionCategory { Id = 10, Name = "Leisure Activities" },
                new TransactionCategory { Id = 11, Name = "Gifts" },
                new TransactionCategory { Id = 12, Name = "Home" },
                    new TransactionCategory { Id = 1201, Name = "Repairs", ParentId = 12 },
                    new TransactionCategory { Id = 1202, Name = "Furniture", ParentId = 12 },
                    new TransactionCategory { Id = 1203, Name = "Decoration", ParentId = 12 }
            );
        }
    }
}
