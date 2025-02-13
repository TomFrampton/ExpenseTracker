using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseTracker.Api.Infrastructure.Migrations
{
    public partial class AddTransactionBalanceColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Balance",
                table: "Transactions",
                type: "decimal(18,6)",
                precision: 18,
                scale: 6,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Balance",
                table: "Transactions");
        }
    }
}
