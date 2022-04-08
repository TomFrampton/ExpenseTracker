using Augustus.Api.Models.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Augustus.Api.Infrastructure.Configuration
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserSuppliedDescription)
                .HasMaxLength(255)
                .IsRequired(false);

            builder
                .HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(x => x.SubCategory)
                .WithMany()
                .HasForeignKey(x => x.SubCategoryId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
