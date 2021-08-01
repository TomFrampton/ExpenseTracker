using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Augustus.Api.Infrastructure.Migrations
{
    public partial class SeedTransactionsAndCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "TransactionCategories",
                columns: new[] { "Id", "Name", "ParentId" },
                values: new object[,]
                {
                    { 1, "Groceries", null },
                    { 2, "Amazon", null },
                    { 3, "Eat Out", null }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "Category", "Date", "Description", "SubCategory" },
                values: new object[,]
                {
                    { 1, 4.99m, null, new DateTime(2021, 8, 1, 14, 53, 8, 479, DateTimeKind.Local).AddTicks(1102), "Tesco", null },
                    { 2, 3.29m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4391), "Asda", null },
                    { 3, 4.99m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4426), "Tesco", null },
                    { 4, 3.29m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4469), "Asda", null },
                    { 5, 4.99m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4472), "Tesco", null },
                    { 6, 3.29m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4475), "Asda", null },
                    { 7, 4.99m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4527), "Tesco", null },
                    { 8, 3.29m, null, new DateTime(2021, 8, 1, 14, 53, 8, 481, DateTimeKind.Local).AddTicks(4543), "Asda", null }
                });

            migrationBuilder.InsertData(
                table: "TransactionCategories",
                columns: new[] { "Id", "Name", "ParentId" },
                values: new object[] { 301, "Restaurant", 3 });

            migrationBuilder.InsertData(
                table: "TransactionCategories",
                columns: new[] { "Id", "Name", "ParentId" },
                values: new object[] { 302, "Pub", 3 });

            migrationBuilder.InsertData(
                table: "TransactionCategories",
                columns: new[] { "Id", "Name", "ParentId" },
                values: new object[] { 303, "Fast-Food", 3 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 301);

            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 302);

            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 303);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "TransactionCategories",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
