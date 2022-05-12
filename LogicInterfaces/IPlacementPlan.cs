using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicInterfaces
{
    public interface IPlacementPlan
    {
        ISection[] Sections { get; }


        
        void CreateSection (int rows, int seatsPerRow);
    }
}
