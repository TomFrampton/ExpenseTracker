using Augustus.Api.Models.Transactions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var transactions = new List<Transaction>
            {
                new Transaction { Id = 1, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
                new Transaction { Id = 2, Date = DateTime.Now, Description = "Asda", Amount = 3.29M }
            };

            return Ok(transactions);
        }
    }
}
