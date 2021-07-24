using Augustus.Api.Models.Health;
using Microsoft.AspNetCore.Mvc;

namespace Augustus.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SystemController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult GetHealthStatus()
        {
            var health = new SystemHealth
            {
                Api = new ItemHealth
                {
                    IsHealthy = true,
                    Error = null
                }
            };

            return Ok(health);
        }
    }
}
