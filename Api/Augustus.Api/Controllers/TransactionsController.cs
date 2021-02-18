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
        private static readonly List<Transaction> _transactions = new List<Transaction>
        {
            new Transaction { Id = 1, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            new Transaction { Id = 2, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            new Transaction { Id = 3, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            new Transaction { Id = 4, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            new Transaction { Id = 5, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            new Transaction { Id = 6, Date = DateTime.Now, Description = "Asda", Amount = 3.29M },
            new Transaction { Id = 7, Date = DateTime.Now, Description = "Tesco", Amount = 4.99M },
            new Transaction { Id = 8, Date = DateTime.Now, Description = "Asda", Amount = 3.29M }
        };

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_transactions);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var transaction = _transactions.FirstOrDefault(x => x.Id == id);

            if (transaction == null)
            {
                return NotFound();
            }

            return Ok(transaction);
        }
    }
}
