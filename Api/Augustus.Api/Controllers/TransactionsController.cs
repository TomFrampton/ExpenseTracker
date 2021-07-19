using Augustus.Api.Models;
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

        private static readonly List<TransactionCategory> _transactionCategories = new List<TransactionCategory>
        {
            new TransactionCategory { Id = 1, Name = "Groceries" },
            new TransactionCategory { Id = 2, Name = "Amazon" },
            new TransactionCategory { Id = 3, Name = "Eat Out", SubCategories = new List<TransactionCategory>
                {
                    new TransactionCategory { Id = 301, Name = "Restaurant" },
                    new TransactionCategory { Id = 302, Name = "Pub" },
                    new TransactionCategory { Id = 303, Name = "Fast-Food" },
                }
            }
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

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            return Ok(_transactionCategories);
        }


        [HttpPost("categorise")]
        public IActionResult Categorise([FromBody] TransactionCategorisationRequest model)
        {
            // To refactor
            var category = _transactionCategories.Single(x => x.Id == model.CategoryId);
            var subCategory = model.SubCategoryId != null ? category.SubCategories.Single(x => x.Id == model.SubCategoryId) : null;

            foreach (var id in model.TransactionIds)
            {
                var transaction = _transactions.Single(x => x.Id == id);

                transaction.Category = category.Name;
                transaction.SubCategory = subCategory?.Name;

            }
            return Ok();
        }
    }
}
