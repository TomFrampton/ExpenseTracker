﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Application.Transactions
{
    public class ExcelTransaction
    {
        public DateTime TransactionDate { get; set; }
        public string TransactionDescription { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? CreditAmount { get; set; }
        public int OrderId { get; set; }
    }
}
