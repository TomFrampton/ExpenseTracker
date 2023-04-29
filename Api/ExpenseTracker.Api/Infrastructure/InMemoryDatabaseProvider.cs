using ExpenseTracker.Api.Models.Exceptions;
using ExpenseTracker.Api.Models.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.IO;

namespace ExpenseTracker.Api.Infrastructure
{
    public class InMemoryDatabaseProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationOptions _applicationOptions;

        public InMemoryDatabaseProvider(IHttpContextAccessor httpContextAccessor, IOptions<ApplicationOptions> applicationOptions)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationOptions = applicationOptions.Value;

            if (string.IsNullOrWhiteSpace(_applicationOptions.DemoDatabaseDirectory))
                throw new ArgumentException("Demo database directory not set in config");
        }

        public ExpenseTrackerContext GetDatabase()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            var sessionStoreFilename = $"{_applicationOptions.DemoDatabaseDirectory}/{session.Id}.sqlite";

            if (!File.Exists(sessionStoreFilename))
            {
                throw new DemoNotInitialisedException("Demo DB not created for current session");
            }

            var optionsBuilder = new DbContextOptionsBuilder<ExpenseTrackerContext>();
            optionsBuilder.UseSqlite($"Filename={sessionStoreFilename}");

            var context = new ExpenseTrackerContext(optionsBuilder.Options);
            context.Database.EnsureCreated();

            return context;
        }
    }
}
