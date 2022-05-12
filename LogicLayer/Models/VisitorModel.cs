using LogicInterfaces;
using System;

namespace LogicLayer.Models
{
    public class VisitorModel : IPotentialVisitor
    {
        public int VisitorId { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool Adult => Age > 12;
        public int Age => (int)Math.Floor((DateTime.Now - DateOfBirth).TotalDays / 364.75f); // once every four years we loose one day
    }
}