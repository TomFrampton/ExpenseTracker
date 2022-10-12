using Augustus.Api.Infrastructure;
using Augustus.Api.Models.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.IO;

namespace Augustus.Api.Services
{
    public class DemoService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationOptions _applicationOptions;

        public DemoService(IHttpContextAccessor httpContextAccessor, IOptions<ApplicationOptions> applicationOptions)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationOptions = applicationOptions.Value;

            if (string.IsNullOrWhiteSpace(_applicationOptions.DemoDatabaseDirectory))
                throw new ArgumentException("Demo database directory not set in config");
        }

        public bool IsStarted()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            var sessionStoreFilename = $"{_applicationOptions.DemoDatabaseDirectory}/{session.Id}.sqlite";

            return File.Exists(sessionStoreFilename);
        }

        public void Start()
        {
            var session = _httpContextAccessor.HttpContext.Session;

            if (!Directory.Exists(_applicationOptions.DemoDatabaseDirectory))
            {
                Directory.CreateDirectory(_applicationOptions.DemoDatabaseDirectory);
            }

            // Build temporary database for this demo session
            var optionsBuilder = new DbContextOptionsBuilder<AugustusContext>();
            optionsBuilder.UseSqlite($"Filename={_applicationOptions.DemoDatabaseDirectory}/{session.Id}.sqlite");

            var context = new AugustusContext(optionsBuilder.Options);
            context.Database.EnsureCreated();

            _httpContextAccessor.HttpContext.Session.SetString("Demo", "Started");
        }
    }
}
