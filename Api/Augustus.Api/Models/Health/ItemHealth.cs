using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Health
{
    public class ItemHealth
    {
        public bool IsHealthy { get; set; }
        public string Error { get; set; }
    }
}
