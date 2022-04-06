using System.Collections.Generic;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionQueryResponse
    {
        public IEnumerable<Transaction> Transactions { get; set; }
        public int TotalTransactionsCount { get; set; }
        public int TotalPages { get; set; }
    }
}
