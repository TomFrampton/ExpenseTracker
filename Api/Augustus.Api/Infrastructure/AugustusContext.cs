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

            //modelBuilder.Entity<Transaction>().HasData(
            //    new Transaction { Id = 1, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            //    new Transaction { Id = 2, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            //    new Transaction { Id = 3, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            //    new Transaction { Id = 4, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            //    new Transaction { Id = 5, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            //    new Transaction { Id = 6, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            //    new Transaction { Id = 7, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            //    new Transaction { Id = 8, Date = DateTime.Now, Description = "Asda", Amount = 3.29M }
            //);

            //modelBuilder.Entity<TransactionCategory>().HasData(
            //    new TransactionCategory { Id = 1, Name = "Groceries" },
            //    new TransactionCategory { Id = 2, Name = "Amazon" },
            //    new TransactionCategory { Id = 3, Name = "Eat Out" },
            //        new TransactionCategory { Id = 301, Name = "Restaurant", ParentId = 3 },
            //        new TransactionCategory { Id = 302, Name = "Pub", ParentId = 3 },
            //        new TransactionCategory { Id = 303, Name = "Fast-Food", ParentId = 3 }
            //);
        }
    }
}
