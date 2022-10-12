using System;

namespace Augustus.Api.Queries
{
    public class TransactionsByCategoryAndMonth
    {
        public static string Sql(bool supportSqlite = false) => $@"
            SELECT
                {(supportSqlite ? "strftime('%m', [Date])" : "DATEPART([Month], [Date])")} AS 'Month',
                {(supportSqlite ? "strftime('%Y', [Date])" : "DATEPART([Year], [Date])")} AS 'Year',
                [CategoryId],
                [tc].[Name] AS 'CategoryName',
                COUNT(*) AS 'TransactionCount',
                SUM(COALESCE([DebitAmount], 0) - COALESCE([CreditAmount], 0)) AS 'TotalAmount'
            FROM
                [Transactions]
            JOIN
                [TransactionCategories] [tc] ON [tc].[Id] = [CategoryId]
            WHERE
                [CategoryId] IS NOT NULL
            GROUP BY
                {(supportSqlite ? "[Month]" : "DATEPART([Month], [Date])")},
                {(supportSqlite ? "[Year]" : "DATEPART([Year], [Date])")},
                [CategoryId],
                [tc].[Name]
            ORDER BY
                [Year],
                [Month]";

        public int Month { get; set; }
        public int Year { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int TransactionCount { get; set; }
        public decimal TotalAmount { get; set; }

        public DateTime Date => new DateTime(Year, Month, 1);
    }
}
