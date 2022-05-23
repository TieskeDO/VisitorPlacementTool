using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System;
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

        public IActionResult Read(string filename)
        {
            try
            {
                string raw = System.IO.File.ReadAllText(Path.Combine("dataSets/" + filename + ".json"));

                return Json(JsonSerializer.Deserialize<EventDataSet>(raw));
            }
            catch(Exception ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}
