using System.Collections.Generic;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionPaginationResponse
    {
        public IEnumerable<Transaction> Transactions { get; set; }
        public int TotalTransactionsCount { get; set; }
        public int TotalPages { get; set; }
    }
}
