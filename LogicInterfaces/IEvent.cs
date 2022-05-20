using System;

namespace LogicInterfaces
{
    public interface IEvent
    {
        DateTime EventDate { get; }
        DateTime TicketSaleStart { get; }
        DateTime TicketSaleEnd { get; }

        int TotalSeats { get; }

        IPotentialVisitor[] Applicants { get; }

        IAcceptedVisitor[] AcceptedVisitors { get; }
        IDeniedVisitor[] DeniedVisitors { get; }

        ISection[] Sections { get; }

        ///// <summary>
        ///// Adds a section with rows and empty seats
        ///// </summary>
        ///// <param name="rows"></param>
        ///// <param name="seatsPerRow"></param>
        //void AddSection(int rows, int seatsPerRow);

        /// <summary>
        /// Fills all the rows and seats with Applicants based on the specified rules
        /// </summary>
        void CreateSeatingPlan();
    }
}