using Augustus.Api.Application.Transactions;
using System;
using Xunit;

namespace Augustus.Api.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var excelParser = new ExcelTransactionsParser();
            excelParser.ParseTransactions(null);
        }
    }
}
