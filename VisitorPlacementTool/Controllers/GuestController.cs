using Microsoft.AspNetCore.Mvc;

namespace VisitorPlacementTool.Controllers
{
    public class GuestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            return View();
        }
    }
}
