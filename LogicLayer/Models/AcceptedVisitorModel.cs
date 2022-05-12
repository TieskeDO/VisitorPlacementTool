using LogicInterfaces;

namespace LogicLayer.Models
{
    internal class AcceptedVisitorModel : IAcceptedVisitor
    {
        public IPotentialVisitor BaseVisitor {get; private set;}

        public ISeat AssignedSeat { get; }

        public AcceptedVisitorModel(IPotentialVisitor visitor)
        {
            BaseVisitor = visitor;
        }
    }
}