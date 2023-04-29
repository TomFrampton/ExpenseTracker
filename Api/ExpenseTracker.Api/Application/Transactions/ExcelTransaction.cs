using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Application.Transactions
{
    public class ExcelTransaction
    {
        public DateTime TransactionDate { get; set; }
        public string TransactionDescription { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? CreditAmount { get; set; }
        public int OrderId { get; set; }
    }

    public class ExcelDemoTransaction : ExcelTransaction
    {
        public string UserSuppliedDescription { get; set; }

        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
    }
}
