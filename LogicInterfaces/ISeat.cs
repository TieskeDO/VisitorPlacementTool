using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicInterfaces
{
    public interface ISeat
    {
        public string SeatIdentifier { get; }
        int SeatNumber { get; }
        bool Occupied => Visitor != null;
        IAcceptedVisitor Visitor { get; }

        IRow ParentRow { get; }

        void SeatVisitor(IPotentialVisitor visitor);
        void UnSeatVisitor();
    }
}
