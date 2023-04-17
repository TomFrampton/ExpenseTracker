using Augustus.Api.Models.Transactions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Infrastructure
{
    public class InMemoryAugustusContext : AugustusContext
    {
        public InMemoryAugustusContext(DbContextOptions<AugustusContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            base.OnConfiguring(options);
            options.UseSqlite(":memory");
        }
    }
}
