using Augustus.Api.Infrastructure;
using Augustus.Api.Models;
using Augustus.Api.Models.Transactions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Services
{
    public interface ITransactionsService
    {
        Task<IEnumerable<Transaction>> GetTransactions();
        Task<Transaction> GetTransaction(int id);
        Task<IEnumerable<TransactionCategory>> GetTransactionCategories();
        Task CategoriseTransactions(TransactionCategorisationRequest model);
    }

    public class TransactionsService : ITransactionsService
    {
        private readonly AugustusContext _context;

        public TransactionsService(AugustusContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Transaction>> GetTransactions()
        {
            return await _context.Transactions
                .Include(x => x.Category)
                .Include(x => x.SubCategory)
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
    }
}
