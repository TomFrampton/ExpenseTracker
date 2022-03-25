using Augustus.Api.Application.Transactions;
using Augustus.Api.Infrastructure;
using Augustus.Api.Models;
using Augustus.Api.Models.Transactions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Services
{
    public class TransactionsService
    {
        private readonly ExcelTransactionsParser _excelTransactionsParser;
        private readonly AugustusContext _context;

        public TransactionsService(ExcelTransactionsParser excelTransactionsParser, AugustusContext context)
        {
            _excelTransactionsParser = excelTransactionsParser ?? throw new ArgumentNullException(nameof(excelTransactionsParser));
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Transaction>> GetTransactions()
        {
            return await _context.Transactions
                .Include(x => x.Category)
                .Include(x => x.SubCategory)
                .OrderBy(x => x.Date)
                // Fix once paging is implemented
                .Take(50)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Transaction> GetTransaction(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }

        public async Task<IEnumerable<TransactionCategory>> GetTransactionCategories()
        {
            return await _context.TransactionCategories
                .Include(x => x.SubCategories)
                .AsNoTracking()
                .Where(x => x.ParentId == null)
                .ToListAsync();
        }

        public async Task CategoriseTransactions(TransactionCategorisationRequest model)
        {
            var category = await _context.TransactionCategories
                .Include(x => x.SubCategories)
                .FirstOrDefaultAsync(x => x.Id == model.CategoryId);

            if (model.SubCategoryId != null && !category.SubCategories.Any(x => x.Id == model.SubCategoryId))
            {
                throw new ArgumentException($"Category with ID {model.SubCategoryId} is not a sub-category of category with ID {model.CategoryId}");
            }

            var transactionsToUpdate = await _context.Transactions
                .Where(x => model.TransactionIds.Contains(x.Id))
                .ToListAsync();

            foreach (var transaction in transactionsToUpdate)
            {
                transaction.CategoryId = model.CategoryId;
                transaction.SubCategoryId = model.SubCategoryId;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<TransactionImportResponse> UploadTransactions(IFormFile excelFile)
        {
            IEnumerable<ExcelTransaction> excelTransactions = _excelTransactionsParser.ParseTransactions(excelFile);
            List<Transaction> entityTransactions = await _context.Transactions.ToListAsync();

            List<TransactionPair> leftJoin = excelTransactions.GroupJoin(
                entityTransactions,
                excel => new
                {
                    Date = excel.TransactionDate,
                    Description = excel.TransactionDescription,
                    CreditAmount = excel.CreditAmount,
                    DebitAmount = excel.DebitAmount
                },
                entity => new
                {
                    Date = entity.Date,
                    Description = entity.Description,
                    CreditAmount = entity.CreditAmount,
                    DebitAmount = entity.DebitAmount
                },
                (excel, entity) => new { excel, entity }
            )
            .SelectMany(
                x => x.entity.DefaultIfEmpty(),
                (x, entity) => new TransactionPair
                {
                    Excel = x.excel,
                    Entity = entity
                }
            )
            .OrderByDescending(x => x.Excel.OrderId)
            .ToList();

            // TODO  - Add balance possibly to improve duplicate detection

            List<Transaction> transactionsToAdd = leftJoin
                .Where(pair => pair.Entity == null)
                .Select(pair => new Transaction
                {
                    Date = pair.Excel.TransactionDate,
                    Description = pair.Excel.TransactionDescription,
                    CreditAmount = pair.Excel.CreditAmount,
                    DebitAmount = pair.Excel.DebitAmount
                })
                .ToList();

            await _context.AddRangeAsync(transactionsToAdd);
            await _context.SaveChangesAsync();

            return new TransactionImportResponse
            {
                ImportedTransactionsCount = transactionsToAdd.Count,
                IgnoredTransactionsCount = leftJoin.Count(pair => pair.Entity != null && pair.Excel != null)
            };
        }

        private class TransactionPair
        {
            public ExcelTransaction Excel { get; set; }
            public Transaction Entity { get; set; }
        }
    }
}
