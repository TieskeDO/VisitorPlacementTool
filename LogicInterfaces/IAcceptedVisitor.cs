using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicInterfaces
{
    public interface IAcceptedVisitor
    {
        IPotentialVisitor BaseVisitor { get; }
        ISeat AssignedSeat { get; }
    }
}
