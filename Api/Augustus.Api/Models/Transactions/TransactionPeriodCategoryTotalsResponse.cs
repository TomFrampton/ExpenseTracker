using System;
using System.Collections.Generic;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionPeriodCategoryTotalsResponse
    {
        public int PeriodStartMonth { get; set; }
        public int PeriodStartYear { get; set; }
        public DateTime PeriodStart { get; set; }

        public IList<CategoryTotal> CategoryTotals { get; set; }

        public class CategoryTotal
        {
            public int CategoryId { get; set; }
            public decimal TotalAmount { get; set; }
        }
    }
}
