
let eventData: EventModel = new EventModel(new Date(), new Date(), new Date());
let guestList: GuestListModel = new GuestListModel(0);
let finalData: GuestModel[] = null;

function ensureValidEvent(): boolean {
    let eventStart: Date = new Date($('#eventDate').val().toString());
    let ticketStart: Date = new Date($('#ticketStart').val().toString());
    let ticketEnd: Date = new Date($('#ticketEnd').val().toString());

    // ensure valid input
    if (eventStart < ticketEnd) {
        alert("event cannot start before the ticket sale ends");
        return false;
    }

    if (ticketEnd < ticketStart) {
        alert("ticket sale cannot end before it starts");
        return false;
    }

    return true;
}

// Keep event model updated
$('#eventDate').change(() => {
    if (ensureValidEvent())
        eventData.eventDate = new Date($('#eventDate').val().toString());;
})

$('#ticketStart').change(() => {
    if (ensureValidEvent())
        eventData.saleStart = new Date($('#ticketStart').val().toString()); 
})

$('#ticketEnd').change(() => {
    if (ensureValidEvent())
        eventData.saleEnd = new Date($('#ticketEnd').val().toString());
})

// Keep geust list template updated
$('#totalGuests').change(e => {
    guestList.guestAmount = parseInt($('#totalGuests').val().toString());
    console.log(guestList);
});

$('#totalGroups').change(e => {
    // update the model
    guestList.groupAmount = parseInt($('#totalGroups').val().toString());

    $('#groupTemplateContainer').empty();

    // update the visuals
    for (let i = 0; i < guestList.groupAmount; i++) {

        // load the list item template so the group can be defined
        let template = LoadFromTemplate("groupTemplate", { number: i + 1, i: i, total: guestList.groups[i].total, adults: guestList.groups[i].adults});

        $('#groupTemplateContainer').append(template);
    }
});

function editGroup(index: number) {
    guestList.groups[index].total = parseInt($('#totalMembers' + index).val().toString());
    guestList.groups[index].adults = parseInt($('#totalAdultMembers' + index).val().toString());
}

$('#guestForm').submit(e => {
    e.preventDefault();
    $('#jsonDisplay').empty();
    GenerateGuestListJson(guestList, eventData).then(data => {

        finalData = data;

        $('#jsonDisplay').append(JSON.stringify(data, (key, value) => {
            if (key.includes("_"))
                return undefined;
            else
                return value;
        }, 4))
    })
});

// save the json file to the server
$('#saveForm').submit(e => {
    e.preventDefault();

    let dsName: string = $('#dsName').val().toString();

    if (dsName === null || dsName.length < 5)
        return;

    $.post(host + "/DataSet/SaveCustomJson", { dataSetName: dsName, event: eventData, guests: finalData })
        .done(() => alert("Nice"))
        .fail(err => { err.responseText });
})

// the sections
$('#addSection').click(e => {
    e.preventDefault();

    // check if the values aren't 0 or negative
    let rows: number = parseInt($('#sectionRows').val().toString()); 
    let seats: number = parseInt($('#sectionSeats').val().toString()); 

    if (rows < 1 || seats < 1) return;

    // add section
    eventData.sections.push(new Section(rows, seats));

    // update visuals
    $('#sections').empty();
    console.log(eventData.sections);
    eventData.sections.forEach(s => {
        $('#sections').append(LoadFromTemplate("sectionTemplate", s));
    })
})