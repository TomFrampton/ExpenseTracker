using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Models.Transactions;
using ExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionsService _transactionsService;

        public TransactionsController(TransactionsService transactionsService)
        {
            _transactionsService = transactionsService ?? throw new ArgumentNullException(nameof(transactionsService));
        }

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] TransactionQueryRequest request, CancellationToken cancellationToken)
        {
            return Ok(await _transactionsService.GetTransactions(request, cancellationToken));
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
        public async Task<IActionResult> GetCategories([FromQuery] bool includeCounts = false)
        {
            return Ok(await _transactionsService.GetTransactionCategories(includeCounts));
        }

        [HttpGet("earliest-year")]
        public async Task<IActionResult> GetEarliestYear()
        {
            return Ok(await _transactionsService.GetTransactionEarliestYear());
        }

        [HttpGet("categorisation-summary")]
        public async Task<IActionResult> GetCategorisationSummary()
        {
            return Ok(await _transactionsService.GetTransactionCategorisationSummary());
        }

        [HttpGet("monthly-category-totals")]
        public async Task<IActionResult> GetMonthlyCategoryTotals()
        {
            return Ok(await _transactionsService.GetMonthlyTransactionCategoryTotals());
        }

        [HttpPost("categorise")]
        public async Task<IActionResult> Categorise([FromBody] TransactionCategorisationRequest model)
        {
            await _transactionsService.CategoriseTransactions(model);
            return NoContent();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            TransactionImportResponse result = await _transactionsService.UploadTransactions(file);
            return Ok(result);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> AddTransactionCategory([FromBody] AddTransactionCategoryRequest model)
        {
            TransactionCategory result = await _transactionsService.AddTransactionCategory(model);
            return Ok(result);
        }

        [HttpPut("categories/{id:int}")]
        public async Task<IActionResult> UpdateTransactionCategory([FromRoute] int id, [FromBody] UpdateTransactionCategoryRequest model)
        {
            model.Id = id;
            TransactionCategory result = await _transactionsService.UpdateTransactionCategory(model);

            return Ok(result);
        }

        [HttpDelete("categories/{id:int}")]
        public async Task<IActionResult> DeleteTransactionCategory([FromRoute] int id)
        {
            await _transactionsService.DeleteTransactionCategory(id);
            return NoContent();
        }
    }
}
