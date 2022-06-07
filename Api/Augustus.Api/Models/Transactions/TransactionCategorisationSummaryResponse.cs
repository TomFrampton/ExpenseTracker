using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionCategorisationSummaryResponse
    {
        public int UncategorisedCount { get; set; }
        public int TotalCount { get; set; }
    }
}
