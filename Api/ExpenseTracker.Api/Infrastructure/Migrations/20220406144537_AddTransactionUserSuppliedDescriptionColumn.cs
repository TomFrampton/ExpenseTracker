using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseTracker.Api.Infrastructure.Migrations
{
    public partial class AddTransactionUserSuppliedDescriptionColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserSuppliedDescription",
                table: "Transactions",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserSuppliedDescription",
                table: "Transactions");
        }
    }
}
