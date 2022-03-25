using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Transactions
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal? CreditAmount { get; set; }
        public decimal? DebitAmount { get; set; }

        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public TransactionCategory Category { get; set; }
        public TransactionCategory SubCategory { get; set; }
    }
}
