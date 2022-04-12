using System.ComponentModel;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionQueryRequest
    {
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string SearchTerm { get; set; }
        public string DateSortDirection { get; set; }
        public string Type { get; set; }
        public int? Year { get; set; }
    }
}
