using ExpenseTracker.Api.Application.Transactions;
using System;
using Xunit;

namespace ExpenseTracker.Api.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var excelParser = new ExcelTransactionsParser();
            excelParser.ParseUploadedTransactions(null);
        }
    }
}
