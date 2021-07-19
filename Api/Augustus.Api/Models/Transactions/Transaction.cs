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
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
    }
}
