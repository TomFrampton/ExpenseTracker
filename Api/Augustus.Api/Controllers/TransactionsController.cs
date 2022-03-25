using Augustus.Api.Models;
using Augustus.Api.Models.Transactions;
using Augustus.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Augustus.Api.Controllers
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
        public async Task<IActionResult> Categorise([FromBody] TransactionCategorisationRequest model)
        {
            await _transactionsService.CategoriseTransactions(model);
            return Ok();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            TransactionImportResponse result = await _transactionsService.UploadTransactions(file);
            return Ok(result);
        }
    }
}
