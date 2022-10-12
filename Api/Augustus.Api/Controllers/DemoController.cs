using Augustus.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Augustus.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DemoController : ControllerBase
    {
        private readonly DemoService _demoService;

        public DemoController(DemoService demoService)
        {
            _demoService = demoService;
        }

        [HttpGet]
        public bool IsStarted()
        {
            return _demoService.IsStarted();
        }

        [HttpPost]
        public IActionResult Start()
        {
            _demoService.Start();

            HttpContext.Session.SetString("Demo", "Started");

            return Ok();
        }
    }
}
