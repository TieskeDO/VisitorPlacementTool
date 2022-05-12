async function GenerateGuestListJson(guestListTemplate: GuestListModel, event: EventModel) : Promise<GuestModel[]> {
    // find out how many individual guests need to be created
    let indivGuests: number = guestListTemplate.guestAmount - guestListTemplate.totalGroupGuests;

    // initialize empty array to push newly created guests to
    let guests: GuestModel[] = [];

    // await the api response
    let apiResponse : any = await $.get("https://randomuser.me/api/?inc=name&results=" + guestListTemplate.guestAmount)

    // validate succesfull api retrieval
    if (apiResponse !== null && apiResponse.info.results === guestListTemplate.guestAmount) {
        // create a variable only holding the name and age of each api result
        let apiNames = apiResponse.results;

        // initialize i outside of for-loop so the itterator count can be shared when creating groups
        let nameIndex: number;

        // create a guestModel for all individual attendees
        for (nameIndex = 0; nameIndex < indivGuests; nameIndex++) {

            let name = apiNames[nameIndex].name;
            let dob: Date = randomBirthday(event.eventDate, true);

            // add a new guest without a groupCode
            guests.push(new GuestModel(
                `${name.first} ${name.last}`,
                dob,
                randomDateBetween(event.saleStart, event.saleEnd)));
        }

        // start adding the groups
        for (let g = 0; g < guestListTemplate.groups.length; g++) {

            let group = guestListTemplate.groups[g];
            let groupCode = `gr-${g + 1}`;

            // loop over all group members
            for (let groupMember = 0; groupMember < group.total; groupMember++) {
                let name = apiNames[nameIndex].name;

                // check if guest should be an adult
                let isAdult: boolean = groupMember < group.adults;

                let dob: Date = randomBirthday(event.eventDate, isAdult);

                // add a new guest without a groupCode
                guests.push(new GuestModel(
                    `${name.first} ${name.last}`,
                    dob,
                    randomDateBetween(event.saleStart, event.saleEnd), // purchase date is still random per member
                    groupCode // add the groupcode for each member
                ));

                // increment the nameIndex
                nameIndex++;
            }
        }

        // check if enough guests were created
        if (guestListTemplate.guestAmount !== guests.length) { console.error(`not enough guests were created. requested: ${guestListTemplate.guestAmount}, created: ${guests.length} `) }

        return guests;
    }
}

function randomBirthday(eventDate: Date, isAdult: boolean): Date {
    // NOTE : TypeScript Dates are annoying

    // adults bday cannot be later than the eventDate - 12 years
    let end: Date = isAdult ? new Date(eventDate.getFullYear() - 12, eventDate.getMonth(), eventDate.getDate()) : eventDate;

    // childs bday cannot be before eventDate - 12 years
    let start: Date = isAdult ? new Date("1920-01-01") : new Date(eventDate.getFullYear() - 12, eventDate.getMonth());

    // return a random date between start and end
    return randomDateBetween(start, end);
}

function randomDateBetween(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

class EventModel {
    private _eventDate: Date;
    private _saleStart: Date;
    private _saleEnd: Date;

    get eventDate(): Date {
        return this._eventDate;
    }

    set eventDate(value: Date) {
        this._eventDate = value;
        this.eventStartDate = value.toLocaleDateString();
    }

    get saleStart(): Date {
        return this._saleStart;
    }

    set saleStart(value: Date) {
        this._saleStart = value;
        this.ticketSaleStart = value.toLocaleDateString();
    }

    get saleEnd(): Date {
        return this._saleEnd;
    }

    set saleEnd(value: Date) {
        this._saleEnd = value;
        this.ticketSaleEnd = value.toLocaleDateString();
    }

    eventStartDate: string
    ticketSaleStart: string
    ticketSaleEnd: string

    constructor(event: Date, start: Date, end: Date) {
        this._eventDate = event;
        this._saleEnd = end;
        this._saleStart = start;
    }
}

class GuestModel {
    name: string;

    private _dateOfBirth: Date;
    private _dateOfPurchase: Date;

    groupCode: string = null;
    dateOfBirth: string;
    dateOfPurchase: string;

    constructor(name: string, dob:Date, dateOfPurchase : Date, groupCode:string = null) {
        this.name = name;
        this._dateOfBirth = dob;
        this.groupCode = groupCode;
        this._dateOfPurchase = dateOfPurchase;
        this.dateOfBirth = this._dateOfBirth.toLocaleDateString();
        this.dateOfPurchase = this._dateOfPurchase.toLocaleDateString();
    }
}

class GuestListModel {
    private _guestAmount: number = 0;
    private _groups: GroupModel[] = [];

    constructor(total: number) {
        this.guestAmount = total;
    }

    get groups() : GroupModel[] {
        return this._groups;
    }

    set groupAmount(value: number) {
        if (value > 0) {
            this._groups.length = value;
            for (var i = 0; i < value; i++) {
                if (this._groups[i] == null) {
                    this._groups[i] = new GroupModel(2, 1);
                }
            }
        }
    }

    get groupAmount(): number {
        return this._groups.length;
    }

    // sum all totals of the specified group models
    get totalGroupGuests(): number {
        let total: number = 0;

        this._groups.forEach(g => {
            total += g.total;
        })

        return total;
    }

    get guestAmount() :number {
        return this._guestAmount;
    }

    // cap at minimum the total amount of guests specified by the defined groups
    set guestAmount(value: number) {
        let tga: number = this.totalGroupGuests;
        if (value < tga) { this._guestAmount = tga }
        else { this._guestAmount = value }
    }

    addGroup(total: number, adults : number) : void {
        this._groups.push(new GroupModel(total, adults));
    }
}

class GroupModel {
    private _total: number = 0;
    private _adults: number = 0;

    constructor(t: number, a: number) {
        // use setters to ensure logical construction
        this.total = t;
        this.adults = a;
    }

    get total() : number {
        return this._total;
    }

    set total(value: number) {
        // ensure the values are correct
        if (value < this._adults) { this._total = this._adults }
        else { this._total = value }
    }

    get adults() : number {
        return this._adults;
    }

    set adults(value: number) {
        // again enforce total as the hard cap
        if (value > this._total) { this._adults = this._total }
        else { this._adults = value }
    }
}

// deprecated
function RunTest() {
    console.log("starting test");

    let template: GuestListModel = new GuestListModel(30);

    // add 3 groups
    template.addGroup(8, 1);
    template.addGroup(6, 2);
    template.addGroup(9, 5);

    console.log("template: ");
    console.log(template);

    let event: EventModel = new EventModel(new Date("2022-4-20"), new Date("2022-1-20"), new Date("2022-4-13"));

    console.log("event: ");
    console.log(event);

    // run the 'prepare JSON' function asynchronously
    GenerateGuestListJson(template, event).then(guests => {
        console.log("guest list: ");
        console.log(guests);
    });
}