using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicInterfaces
{
    public interface IDeniedVisitor
    {
        IPotentialVisitor Visitor { get; }
        DeniedAccesReasons Reason { get; }
    }
}
