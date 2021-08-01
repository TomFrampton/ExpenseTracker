using Augustus.Api.Models;
using Augustus.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Augustus.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionsService _transactionsService;

        public TransactionsController(ITransactionsService transactionsService)
        {
            _transactionsService = transactionsService ?? throw new ArgumentNullException(nameof(transactionsService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _transactionsService.GetTransactions());
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transaction = await _transactionsService.GetTransaction(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return Ok(transaction);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            return Ok(await _transactionsService.GetTransactionCategories());
        }


        [HttpPost("categorise")]
        public IActionResult Categorise([FromBody] TransactionCategorisationRequest model)
        {
            // To refactor
            //var category = _transactionCategories.Single(x => x.Id == model.CategoryId);
            //var subCategory = model.SubCategoryId != null ? category.SubCategories.Single(x => x.Id == model.SubCategoryId) : null;

            //foreach (var id in model.TransactionIds)
            //{
            //    var transaction = _transactions.Single(x => x.Id == id);

            //    transaction.Category = category.Name;
            //    transaction.SubCategory = subCategory?.Name;

            //}
            return Ok();
        }
    }
}
