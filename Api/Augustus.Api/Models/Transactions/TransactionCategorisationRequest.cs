using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionCategorisationRequest
    {
        public IEnumerable<int> TransactionIds { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
    }
}
