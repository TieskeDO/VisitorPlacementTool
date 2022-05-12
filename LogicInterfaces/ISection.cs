namespace LogicInterfaces
{
    public interface ISection
    {
        string SectionIdentifier { get; }

        IRow[] Rows { get; }

        int RowCount { get; }
        int SeatPerRowCount { get; }

        void CreateRows(int amount, int seatsPerRow);
    }
}