using Augustus.Api.Models;
using Augustus.Api.Models.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Augustus.Api.Middleware
{
    /// <summary>
    /// Enriches response with correct HTTP code for the demo not initialised error.
    /// </summary>
    public class DemoNotInitialisedExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public DemoNotInitialisedExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (DemoNotInitialisedException)
            {
                // TODO - Improve response
                httpContext.Response.StatusCode = StatusCode.DemoNotInitialised;
            }
        }
    }
}
