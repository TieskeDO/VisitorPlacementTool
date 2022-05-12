using LogicInterfaces;
using LogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicLayer
{
    public class EventModel : IEvent
    {
        private List<IPotentialVisitor> _potentialVisitors;
        private List<IAcceptedVisitor> _acceptedVisitors;
        private List<IDeniedVisitor> _deniedVisitors;

        private List<ISection> _sections;

        #region Properties

        public DateTime EventDate {get; set;}

        public DateTime TicketSaleStart { get; set; }

        public DateTime TicketSaleEnd {get; set;}

        public IPotentialVisitor[] Applicants => _potentialVisitors.ToArray();

        public IAcceptedVisitor[] AcceptedVisitors => _acceptedVisitors.ToArray();

        public IDeniedVisitor[] DeniedVisitors => _deniedVisitors.ToArray();

        public ISection[] Sections => _sections.ToArray();

        public int TotalSeats
        {
            get
            {
                int[] seatsPerSection = new int[Sections.Length];

                for (int i = 0; i < Sections.Length; i++)
                {
                    seatsPerSection[i] = Sections[i].RowCount * Sections[i].SeatPerRowCount;
                }

                return seatsPerSection.Sum();
            }
        }

        #endregion

        public EventModel(DateTime eventDate, DateTime ticketSaleStart, DateTime? ticketSaleEnd = null)
        {
            EventDate = eventDate;
            TicketSaleStart = ticketSaleStart;
            TicketSaleEnd = ticketSaleEnd != null ? ticketSaleEnd.Value : eventDate;

            _sections = new List<ISection>();

            _potentialVisitors = new List<IPotentialVisitor>();
            _acceptedVisitors = new List<IAcceptedVisitor>();
            _deniedVisitors = new List<IDeniedVisitor>();
        }

        public void AddSection(int rows, int seatsPerRow)
        {
            string identifier = ((char)(_sections.Count() + 65)).ToString(); // ASCII offset of 65 to get the alphabet corresponding character

            _sections.Add(new SectionModel(identifier, rows, seatsPerRow));
        }

        public void CreateSeatingPlan()
        {
            throw new NotImplementedException();
        }
    }
}
