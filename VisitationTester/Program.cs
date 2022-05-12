// See https://aka.ms/new-console-template for more information

using LogicLayer;

EventModel model = new EventModel(DateTime.Now, DateTime.Now);

model.AddSection(3, 4);
model.AddSection(5, 5);
model.AddSection(4, 2);

Console.WriteLine(model.TotalSeats);

Console.ReadKey();

