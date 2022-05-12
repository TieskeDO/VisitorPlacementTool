using LogicInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicLayer.Models
{
    public class SectionModel : ISection
    {
        private List<IRow> _rows;

        public string SectionIdentifier { get; private set; }

        public IRow[] Rows => _rows.ToArray();

        public int SeatPerRowCount { get; private set; }

        public int RowCount => _rows.Count();

        public SectionModel(string identifier, int rows, int seatsPerRow)
        {
            SectionIdentifier = identifier;
            SeatPerRowCount = seatsPerRow;

            _rows = new List<IRow>();

            for (int i = 0; i < rows; i++)
            {
                _rows.Add(new RowModel(i + 1, seatsPerRow, this));
            }


        }

        public void CreateRows(int amount, int seatsPerRow)
        {
            throw new NotImplementedException();
        }
    }
}
