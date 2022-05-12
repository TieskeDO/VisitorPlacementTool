using LogicLayer;
using System;

namespace FrontEnd.Models
{
    public class EventDataSet
    {
        public string DataSetName { get; set; }
        public EventDataTemplate Event { get; set; }
        public GuestDataTemplate[] Guests { get; set; }

        public class EventDataTemplate
        {
            public DateTime EventStartDate { get; set; }
            public DateTime TicketSaleStart { get; set; }
            public DateTime TicketSaleEnd { get; set; }
        }

        public class GuestDataTemplate
        {
            public string Name { get; set; }
            public string GroupCode { get; set; }
            public DateTime DateOfBirth { get; set; }
            public DateTime DateOfPurchase { get; set; }
        }
    }
}
