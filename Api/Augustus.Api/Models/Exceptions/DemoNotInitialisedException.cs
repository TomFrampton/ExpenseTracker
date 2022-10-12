using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Augustus.Api.Models.Exceptions
{
    public class DemoNotInitialisedException : Exception
    {
        public DemoNotInitialisedException() : base() { }

        public DemoNotInitialisedException(string message) : base(message) { }

        public DemoNotInitialisedException(string message, Exception innerException) : base(message, innerException) { }
    }
}
