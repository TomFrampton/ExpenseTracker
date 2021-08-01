﻿// <auto-generated />
using System;
using Augustus.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Augustus.Api.Infrastructure.Migrations
{
    [DbContext(typeof(AugustusContext))]
    [Migration("20210801135308_SeedTransactionsAndCategories")]
    partial class SeedTransactionsAndCategories
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.8")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Augustus.Api.Models.Transactions.Transaction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 6)
                        .HasColumnType("decimal(18,6)");

                    b.Property<string>("Category")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SubCategory")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Transactions");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Amount = 4.99m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 479, DateTimeKind.Local).AddTicks(1102),
                            Description = "Tesco"
                        },
                        new
                        {
                            Id = 2,
                            Amount = 3.29m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4391),
                            Description = "Asda"
                        },
                        new
                        {
                            Id = 3,
                            Amount = 4.99m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4426),
                            Description = "Tesco"
                        },
                        new
                        {
                            Id = 4,
                            Amount = 3.29m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4469),
                            Description = "Asda"
                        },
                        new
                        {
                            Id = 5,
                            Amount = 4.99m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4472),
                            Description = "Tesco"
                        },
                        new
                        {
                            Id = 6,
                            Amount = 3.29m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4475),
                            Description = "Asda"
                        },
                        new
                        {
                            Id = 7,
                            Amount = 4.99m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4527),
                            Description = "Tesco"
                        },
                        new
                        {
                            Id = 8,
                            Amount = 3.29m,
                            Date = new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4543),
                            Description = "Asda"
                        });
                });

            modelBuilder.Entity("Augustus.Api.Models.Transactions.TransactionCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ParentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ParentId");

                    b.ToTable("TransactionCategories");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Groceries"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Amazon"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Eat Out"
                        },
                        new
                        {
                            Id = 301,
                            Name = "Restaurant",
                            ParentId = 3
                        },
                        new
                        {
                            Id = 302,
                            Name = "Pub",
                            ParentId = 3
                        },
                        new
                        {
                            Id = 303,
                            Name = "Fast-Food",
                            ParentId = 3
                        });
                });

            modelBuilder.Entity("Augustus.Api.Models.Transactions.TransactionCategory", b =>
                {
                    b.HasOne("Augustus.Api.Models.Transactions.TransactionCategory", null)
                        .WithMany("SubCategories")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.NoAction);
                });

            modelBuilder.Entity("Augustus.Api.Models.Transactions.TransactionCategory", b =>
                {
                    b.Navigation("SubCategories");
                });
#pragma warning restore 612, 618
        }
    }
}
