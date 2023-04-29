using System.Collections.Generic;

namespace ExpenseTracker.Api.Models.Transactions
{
    public class TransactionQueryResponse
    {
        public IEnumerable<Transaction> Transactions { get; set; }
        public int TotalTransactionsCount { get; set; }
        public int TotalPages { get; set; }
    }
}
