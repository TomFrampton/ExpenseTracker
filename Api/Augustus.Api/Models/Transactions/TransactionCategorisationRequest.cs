using System.Collections.Generic;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionCategorisationRequest
    {
        public IEnumerable<int> TransactionIds { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public string Description { get; set; }
    }
}
