using ExpenseTracker.Api.Infrastructure.Configuration;
using ExpenseTracker.Api.Models.Transactions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ExpenseTracker.Api.Infrastructure
{
    public class ExpenseTrackerContext : DbContext
    {
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionCategory> TransactionCategories { get; set; }

        public ExpenseTrackerContext(DbContextOptions<ExpenseTrackerContext> options) : base(options)
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
        }
    }
}
