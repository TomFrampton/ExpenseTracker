using ExpenseTracker.Api.Application.Transactions;
using ExpenseTracker.Api.Infrastructure;
using ExpenseTracker.Api.Middleware;
using ExpenseTracker.Api.Models.Options;
using ExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;

namespace ExpenseTracker.Api
{
    public class Startup
    {
        private const string DevelopmentCorsPolicy = "DevelopmentCorsPolicy";

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry();

            services.AddOptions();

            var applicationOptions = Configuration.GetSection("Application");
            services.Configure<ApplicationOptions>(applicationOptions);

            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(1000);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.AddCors(options =>
            {
                options.AddPolicy(DevelopmentCorsPolicy, builder =>
                {
                    builder
                        .WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .AllowAnyMethod();
                });
            });

            if (applicationOptions.GetValue<bool>("IsDemo"))
            {
                // If we are in demo mode then use the in-memory database provider
                services.AddScoped(serviceProvider =>
                {
                    var provider = serviceProvider.GetRequiredService<InMemoryDatabaseProvider>();
                    return provider.GetDatabase();
                });
            }
            else
            {
                // If in non-demo mode then use the main database
                services.AddDbContext<ExpenseTrackerContext>(options =>
                {
                    options.UseSqlServer(Configuration.GetConnectionString("ExpenseTracker"), providerOptions =>
                    {
                        providerOptions.EnableRetryOnFailure();
                    });
                });
            }

            services.AddTransient<TransactionsService>();
            services.AddTransient<DemoService>();
            services.AddTransient<ExcelTransactionsParser>();
            services.AddTransient<InMemoryDatabaseProvider>();

            // To allow access to HttpContext.Session via DI
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddControllers();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "ExpenseTracker", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IOptions<ApplicationOptions> applicationOptions)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseCors(DevelopmentCorsPolicy);

                app.UseSwagger();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "ExpenseTracker V1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            app.UseSession();

            app.UseMiddleware<DemoNotInitialisedExceptionMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (!applicationOptions.Value.IsDemo)
            {
                using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
                {
                    var context = serviceScope.ServiceProvider.GetRequiredService<ExpenseTrackerContext>();
                    //context.Database.Migrate();
                    context.Database.EnsureCreated();
                }
            }
        }
    }
}
