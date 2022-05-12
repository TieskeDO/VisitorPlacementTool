using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicInterfaces
{
    public interface IRow
    {
        int RowNumber { get; }

        ISeat[] Seats { get; }
        public bool FullyOccupied { get; }
        int TotalSeats => Seats.Length;
        ISection ParentSection { get; }

    }
}
