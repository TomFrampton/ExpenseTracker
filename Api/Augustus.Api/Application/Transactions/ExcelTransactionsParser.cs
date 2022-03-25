using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using OfficeOpenXml.Export.ToDataTable;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace Augustus.Api.Application.Transactions
{
    public class ExcelTransactionsParser
    {
        /// <summary>
        /// 1-index of the last column to read.
        /// </summary>
        private const int _lastColumn = 8;

        public IEnumerable<ExcelTransaction> ParseTransactions(IFormFile excelFile)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            DataTable dataTable = null;

            var dataTableOptions = ToDataTableOptions.Create(options =>
            {
                // Columns 0-indexed
                options.Mappings.Add(6, "Debit Amount", true);
                options.Mappings.Add(7, "Credit Amount", true);
            });

            using (Stream excelFileStream = excelFile.OpenReadStream())
            {
                using (var package = new ExcelPackage(excelFileStream))
                {
                    ExcelWorksheet workbook = package.Workbook.Worksheets.First();

                    // Columns + rows 1-indexed
                    dataTable = workbook.Cells[1, 1, workbook.Dimension.End.Row, _lastColumn].ToDataTable(dataTableOptions);
                }
            }

            var transactions = new List<ExcelTransaction>();

            // Take the rows in reverse order
            for (var i = dataTable.Rows.Count - 1; i >= 0; i--)
            {
                DataRow row = dataTable.Rows[i];

                transactions.Add(new ExcelTransaction
                {
                    TransactionDate = Convert.ToDateTime(row[0]),
                    TransactionDescription = Convert.ToString(row[5]),
                    DebitAmount = ConvertAmount(row[6]),
                    CreditAmount = ConvertAmount(row[7]),
                    OrderId = i + 1
                });
            }

            return transactions;
        }

        private decimal? ConvertAmount(object amount)
        {
            var value = Convert.ToDecimal(amount);
            return value == 0M ? null : value;
        }
    }
}
