using ExpenseTracker.Api.Application.Transactions;
using ExpenseTracker.Api.Extensions;
using ExpenseTracker.Api.Infrastructure;
using ExpenseTracker.Api.Models.Options;
using ExpenseTracker.Api.Models.Transactions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Api.Services
{
    public class DemoService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationOptions _applicationOptions;
        private readonly ExcelTransactionsParser _excelTransactionsParser;

        public DemoService(
            IHttpContextAccessor httpContextAccessor,
            IOptions<ApplicationOptions> applicationOptions,
            ExcelTransactionsParser excelTransactionsParser)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationOptions = applicationOptions.Value;
            _excelTransactionsParser = excelTransactionsParser;

            if (string.IsNullOrWhiteSpace(_applicationOptions.DemoDatabaseDirectory))
                throw new ArgumentException("Demo database directory not set in config");
        }

        public bool IsStarted()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            var sessionStoreFilename = $"{_applicationOptions.DemoDatabaseDirectory}/{session.Id}.sqlite";

            return File.Exists(sessionStoreFilename);
        }

        public async Task Start()
        {
            var session = _httpContextAccessor.HttpContext.Session;

            if (!Directory.Exists(_applicationOptions.DemoDatabaseDirectory))
            {
                Directory.CreateDirectory(_applicationOptions.DemoDatabaseDirectory);
            }

            // Build temporary database for this demo session
            var optionsBuilder = new DbContextOptionsBuilder<ExpenseTrackerContext>();
            optionsBuilder.UseSqlite($"Filename={_applicationOptions.DemoDatabaseDirectory}/{session.Id}.sqlite");

            var context = new ExpenseTrackerContext(optionsBuilder.Options);
            context.Database.EnsureCreated();

            // If there are no transactions added then initialise demo data
            if (!await context.Transactions.AnyAsync())
            {
                IEnumerable<ExcelDemoTransaction> excelTransactions = _excelTransactionsParser.ParseDemoTransactions(_applicationOptions.DemoTransactionsFile);

                if (excelTransactions.Any())
                {
                    var transactions = excelTransactions.SelectList(x => new Transaction
                    {
                        Date = x.TransactionDate,
                        Description = x.TransactionDescription,
                        UserSuppliedDescription = x.UserSuppliedDescription,
                        CreditAmount = x.CreditAmount,
                        DebitAmount = x.DebitAmount,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId
                    });

                    await context.AddRangeAsync(transactions);
                    await context.SaveChangesAsync();
                }
            }

            _httpContextAccessor.HttpContext.Session.SetString("Demo", "Started");
        }
    }
}
