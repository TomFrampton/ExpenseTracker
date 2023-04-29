using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using OfficeOpenXml.Export.ToDataTable;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace ExpenseTracker.Api.Application.Transactions
{
    public class ExcelTransactionsParser
    {
        /// <summary>
        /// 1-index of the last column to read on the uploaded spreadsheets.
        /// </summary>
        private const int _lastUploadedColumn = 8;

        /// <summary>
        /// 1-index of the last column to read on the demo spreadsheet.
        /// </summary>
        private const int _lastDemoColumn = 7;

        public IEnumerable<ExcelTransaction> ParseUploadedTransactions(IFormFile excelFile)
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
                    dataTable = workbook.Cells[1, 1, workbook.Dimension.End.Row, _lastUploadedColumn].ToDataTable(dataTableOptions);
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

        public IEnumerable<ExcelDemoTransaction> ParseDemoTransactions(string demoTransactionsFilepath)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            DataTable dataTable = null;

            var dataTableOptions = ToDataTableOptions.Create(options =>
            {
                // Custom mappings needed for columns that allow null values
                // Columns 0-indexed
                options.Mappings.Add(3, "Debit Amount", true);
                options.Mappings.Add(4, "Credit Amount", true);
                options.Mappings.Add(5, "Category", true);
                options.Mappings.Add(6, "Sub-Category", true);
            });

            using (Stream excelFileStream = new FileStream(demoTransactionsFilepath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                using (var package = new ExcelPackage(excelFileStream))
                {
                    ExcelWorksheet workbook = package.Workbook.Worksheets.First();

                    // Columns + rows 1-indexed
                    dataTable = workbook.Cells[1, 1, workbook.Dimension.End.Row, _lastDemoColumn].ToDataTable(dataTableOptions);
                }
            }

            var transactions = new List<ExcelDemoTransaction>();

            // Take the rows in top-down order
            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                DataRow row = dataTable.Rows[i];

                transactions.Add(new ExcelDemoTransaction
                {
                    TransactionDate = Convert.ToDateTime(row[0]),
                    TransactionDescription = Convert.ToString(row[1]),
                    UserSuppliedDescription = Convert.ToString(row[2]),
                    DebitAmount = ConvertAmount(row[3]),
                    CreditAmount = ConvertAmount(row[4]),
                    CategoryId = ConvertCategoryId(row[5]),
                    SubCategoryId = ConvertCategoryId(row[6]),
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

        private int? ConvertCategoryId(object amount)
        {
            var value = Convert.ToInt32(amount);
            return value == 0 ? null : value;
        }
    }
}
