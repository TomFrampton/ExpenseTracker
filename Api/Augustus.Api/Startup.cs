using Augustus.Api.Application.Transactions;
using Augustus.Api.Infrastructure;
using Augustus.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api
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

            services.AddCors(options =>
            {
                options.AddPolicy(DevelopmentCorsPolicy, builder =>
                {
                    builder
                        .WithOrigins("http://localhost:4200")
                        .WithHeaders("Content-Type")
                        .WithMethods(HttpMethods.Get, HttpMethods.Post, HttpMethods.Put, HttpMethods.Delete);
                });
            });

            services.AddDbContext<AugustusContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("Augustus"), providerOptions =>
                {
                    providerOptions.EnableRetryOnFailure();
                });
            });

            services.AddTransient<TransactionsService>();
            services.AddTransient<ExcelTransactionsParser>();

            services.AddControllers();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Augustus", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseCors(DevelopmentCorsPolicy);

                app.UseSwagger();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "Augustus V1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<AugustusContext>();
                context.Database.Migrate();
            }
        }
    }
}
