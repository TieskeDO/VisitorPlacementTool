using LogicInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicLayer.Models
{
    public class SeatModel : ISeat
    {
        public int SeatNumber { get; private set; }

        public IAcceptedVisitor Visitor { get; private set; } = null;

        public IRow ParentRow {get; private set;}

        public string SeatIdentifier => $"{ParentRow.ParentSection.SectionIdentifier}{ParentRow.RowNumber}-{SeatNumber}";

        public SeatModel(int identifier, IRow parentRow)
        {
            SeatNumber = identifier;
            ParentRow = parentRow;
        }

        public void SeatVisitor(IPotentialVisitor visitor)
        {
            Visitor = new AcceptedVisitorModel(visitor);
        }

        public void UnSeatVisitor()
        {
            Visitor = null;
        }
    }
}
