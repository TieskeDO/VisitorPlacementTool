using LogicInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicLayer.Models
{
    public class RowModel : IRow
    {
        private List<ISeat> _seats;

        public int RowNumber { get; private set; }

        public ISeat[] Seats => _seats.ToArray();

        public ISection ParentSection { get; private set; }

        public bool FullyOccupied => Seats.All(s => s.Occupied);

        public RowModel(int identifier, int seats, ISection parentSection)
        {
            RowNumber = identifier;
            ParentSection = parentSection;

            _seats = new List<ISeat>();

            for (int i = 0; i < seats; i++)
            {
                _seats.Add(new SeatModel(i + 1, this));
            }
        }
    }
}
