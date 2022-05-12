using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LogicLayer;
using Microsoft.Extensions.Hosting.Internal;
using System.IO;
using System.Text.Json;

namespace FrontEnd.Controllers
{
    public class DataSetController : Controller
    {
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SaveCustomJson(EventDataSet dataset)
        {
            try
            {
                System.IO.File.WriteAllText("dataSets/" + dataset.DataSetName + ".json", JsonSerializer.Serialize(dataset));
                
                return Ok("dataset saved succesfully");
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}
