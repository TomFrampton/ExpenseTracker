using ExpenseTracker.Api.Application.Transactions;
using ExpenseTracker.Api.Extensions;
using ExpenseTracker.Api.Infrastructure;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Models.Exceptions;
using ExpenseTracker.Api.Models.Options;
using ExpenseTracker.Api.Models.Transactions;
using ExpenseTracker.Api.Queries;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Services
{
    public class TransactionsService
    {
        private readonly ExcelTransactionsParser _excelTransactionsParser;
        private readonly ExpenseTrackerContext _context;
        private readonly ApplicationOptions _applicationOptions;

        public TransactionsService(ExcelTransactionsParser excelTransactionsParser, ExpenseTrackerContext context, IOptions<ApplicationOptions> applicationOptions)
        {
            _excelTransactionsParser = excelTransactionsParser ?? throw new ArgumentNullException(nameof(excelTransactionsParser));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _applicationOptions = applicationOptions?.Value ?? throw new ArgumentNullException(nameof(applicationOptions));
        }

        public async Task<TransactionQueryResponse> GetTransactions(TransactionQueryRequest request, CancellationToken cancellationToken)
        {
            int pageNumber = request.PageNumber ?? 1;
            int pageSize = request.PageSize ?? 100;

            int skipCount = (pageNumber - 1) * pageSize;

            IQueryable<Transaction> query = _context.Transactions
                .AsNoTracking()
                .Include(x => x.Category)
                .Include(x => x.SubCategory)
                .OrderBy(x => x.Date);

            if (request.SearchTerm != null)
            {
                query = query.Where(x =>
                    EF.Functions.Like(x.Description, $"%{request.SearchTerm}%") ||
                    EF.Functions.Like(x.UserSuppliedDescription, $"%{request.SearchTerm}%"));
            }

            if (request.Type == TransactionType.Uncategorised)
            {
                query = query.Where(x => x.CategoryId == null);
            }
            else if (request.Type == TransactionType.Categorised)
            {
                query = query.Where(x => x.CategoryId != null);
            }

            if (request.Year.HasValue)
            {
                var yearStart = new DateTime(request.Year.Value, 1, 1);
                query = query.Where(x => x.Date >= yearStart && x.Date < yearStart.AddYears(1));
            }

            // Count query to get total number of transactions in search
            int totalTransactionsCount = await query.CountAsync(cancellationToken);

            // Apply ordering by date if applicable
            if (request.DateSortDirection == SortDirection.Ascending)
            {
                query = query.OrderBy(x => x.Date);
            }
            else if (request.DateSortDirection == SortDirection.Descending)
            {
                query = query.OrderByDescending(x => x.Date);
            }

            // Paged query to return the transactions
            var pagedTransactions = await query
                .Skip(skipCount)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            int totalPages = (int) Math.Ceiling((double) totalTransactionsCount / pageSize);

            return new TransactionQueryResponse
            {
                Transactions = pagedTransactions,
                TotalTransactionsCount = totalTransactionsCount,
                TotalPages = totalPages
            };
        }

        public async Task<Transaction> GetTransaction(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }

        public async Task<IEnumerable<TransactionCategoryResponse>> GetTransactionCategories(bool includeCounts = false)
        {
            return await _context.TransactionCategories
                .AsNoTracking()
                .SelectListAsync(entity => new TransactionCategoryResponse
                {
                    Id = entity.Id,
                    Name = entity.Name,
                    ParentId = entity.ParentId,
                    Count = includeCounts ? _context.Transactions.Count(t => t.CategoryId == entity.Id || t.SubCategoryId == entity.Id) : null
                });
        }

        public async Task<int?> GetTransactionEarliestYear()
        {
            var earliestDate = await _context.Transactions
                .OrderBy(x => x.Date)
                .Select(x => x.Date as DateTime?)
                .FirstOrDefaultAsync();

            return earliestDate?.Year;
        }

        public async Task<TransactionCategorisationSummaryResponse> GetTransactionCategorisationSummary()
        {
            var uncategorisedCount = await _context.Transactions.CountAsync(t => t.CategoryId == null);
            var totalCount = await _context.Transactions.CountAsync();

            return new TransactionCategorisationSummaryResponse
            {
                UncategorisedCount = uncategorisedCount,
                TotalCount = totalCount
            };
        }

        public async Task<IEnumerable<TransactionPeriodCategoryTotalsResponse>> GetMonthlyTransactionCategoryTotals()
        {
            // Don't use a using statement here as we don't want to dispose of the connection manually
            var connection = _context.Database.GetDbConnection();
            var result = await connection.QueryAsync<TransactionsByCategoryAndMonth>(TransactionsByCategoryAndMonth.Sql(_applicationOptions.IsDemo));

            var response = result
                .GroupBy(x => x.Date)
                .OrderBy(x => x.Key)
                .SelectList(x => new TransactionPeriodCategoryTotalsResponse
                {
                    PeriodStartMonth = x.Key.Month,
                    PeriodStartYear = x.Key.Year,
                    PeriodStart = x.Key,
                    CategoryTotals = x.SelectList(y => new TransactionPeriodCategoryTotalsResponse.CategoryTotal
                    {
                        CategoryId = y.CategoryId,
                        TotalAmount = y.TotalAmount
                    })
                });

            return response;
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
                transaction.UserSuppliedDescription = model.Description;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<TransactionImportResponse> UploadTransactions(IFormFile excelFile)
        {
            IEnumerable<ExcelTransaction> excelTransactions = _excelTransactionsParser.ParseUploadedTransactions(excelFile);
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

            // TODO  - Add 'balance' field possibly to improve duplicate detection

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

        public async Task<TransactionCategory> AddTransactionCategory(AddTransactionCategoryRequest model)
        {
            // TODO - Do proper validation with fluent validations
            if (string.IsNullOrWhiteSpace(model?.Name))
                throw new ArgumentException("New transaction category name is missing");

            var category = new TransactionCategory
            {
                Name = model.Name,
                ParentId = model.ParentId,
            };

            await _context.AddAsync(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<TransactionCategory> UpdateTransactionCategory(UpdateTransactionCategoryRequest model)
        {
            // TODO - Do proper validation with fluent validations
            if (string.IsNullOrWhiteSpace(model?.Name))
                throw new ArgumentException("New transaction category name is missing");

            TransactionCategory category = await _context.TransactionCategories.FindAsync(model.Id);

            if (category == null)
                throw new NotFoundException($"Transaction category with ID '{model.Id}' not found");

            category.Name = model.Name;

            _context.Update(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task DeleteTransactionCategory(int id)
        {
            TransactionCategory category = await _context.TransactionCategories.FindAsync(id);

            if (category == null)
                throw new NotFoundException($"Transaction category with ID '{id}' not found");

            IExecutionStrategy strategy = _context.Database.CreateExecutionStrategy();

            // https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#execution-strategies-and-transactions
            await strategy.ExecuteInTransactionAsync(
                operation: async () =>
                {
                    // We can't use cascade delete or set null in these FK relationships due to multiple cascade paths.
                    // To fix this would have to have Transaction reference a single Category, not an explicit main and sub category.
                    // Think about changing this and then having the main/sub categorisation managed implicitly.
                    await _context.Database.ExecuteSqlRawAsync(@$"
                        UPDATE Transactions SET CategoryId = NULL WHERE CategoryId = {id};
                        UPDATE Transactions SET SubCategoryId = NULL WHERE SubCategoryId = {id};");

                    _context.Remove(category);

                    await _context.SaveChangesAsync();
                },
                verifySucceeded: () =>
                {
                    return _context.TransactionCategories.NotAnyAsync(x => x.Id == id);
                });
        }

        private class TransactionPair
        {
            public ExcelTransaction Excel { get; set; }
            public Transaction Entity { get; set; }
        }
    }
}
