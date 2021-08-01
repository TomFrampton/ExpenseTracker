using Augustus.Api.Infrastructure;
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
            return await _context.Transactions.AsNoTracking().ToListAsync();
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
    }
}
