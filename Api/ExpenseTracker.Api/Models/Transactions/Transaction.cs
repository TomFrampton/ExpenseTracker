using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Models.Transactions
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal? CreditAmount { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? Balance { get; set; }

        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }

        /// <summary>
        /// A description provided by the user during categorisation for easier reading.
        /// </summary>
        public string UserSuppliedDescription { get; set; }

        public bool IsCategorised => CategoryId.HasValue;

        public TransactionCategory Category { get; set; }
        public TransactionCategory SubCategory { get; set; }
    }
}
