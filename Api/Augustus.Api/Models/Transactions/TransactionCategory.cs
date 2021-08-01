using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Transactions
{
    public class TransactionCategory
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }

        public string Name { get; set; }

        public IEnumerable<TransactionCategory> SubCategories { get; set; } = new List<TransactionCategory>();
    }
}
