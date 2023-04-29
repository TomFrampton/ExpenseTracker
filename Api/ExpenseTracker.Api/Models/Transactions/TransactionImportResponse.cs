using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Models.Transactions
{
    public class TransactionImportResponse
    {
        public int ImportedTransactionsCount { get; set; }
        public int IgnoredTransactionsCount { get; set; }
        public int TotalTransactionsFoundCount => ImportedTransactionsCount + IgnoredTransactionsCount;
    }
}
