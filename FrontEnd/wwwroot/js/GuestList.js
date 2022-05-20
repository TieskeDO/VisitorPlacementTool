var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function GenerateGuestListJson(guestListTemplate, event) {
    return __awaiter(this, void 0, void 0, function* () {
        // find out how many individual guests need to be created
        let indivGuests = guestListTemplate.guestAmount - guestListTemplate.totalGroupGuests;
        // initialize empty array to push newly created guests to
        let guests = [];
        // await the api response
        let apiResponse = yield $.get("https://randomuser.me/api/?inc=name&results=" + guestListTemplate.guestAmount);
        // validate succesfull api retrieval
        if (apiResponse !== null && apiResponse.info.results === guestListTemplate.guestAmount) {
            // create a variable only holding the name and age of each api result
            let apiNames = apiResponse.results;
            // initialize i outside of for-loop so the itterator count can be shared when creating groups
            let nameIndex;
            // create a guestModel for all individual attendees
            for (nameIndex = 0; nameIndex < indivGuests; nameIndex++) {
                let name = apiNames[nameIndex].name;
                let dob = randomBirthday(event.eventDate, true);
                // add a new guest without a groupCode
                guests.push(new GuestModel(`${name.first} ${name.last}`, dob, randomDateBetween(event.saleStart, event.saleEnd)));
            }
            // start adding the groups
            for (let g = 0; g < guestListTemplate.groups.length; g++) {
                let group = guestListTemplate.groups[g];
                let groupCode = `gr-${g + 1}`;
                // loop over all group members
                for (let groupMember = 0; groupMember < group.total; groupMember++) {
                    let name = apiNames[nameIndex].name;
                    // check if guest should be an adult
                    let isAdult = groupMember < group.adults;
                    let dob = randomBirthday(event.eventDate, isAdult);
                    // add a new guest without a groupCode
                    guests.push(new GuestModel(`${name.first} ${name.last}`, dob, randomDateBetween(event.saleStart, event.saleEnd), // purchase date is still random per member
                    groupCode // add the groupcode for each member
                    ));
                    // increment the nameIndex
                    nameIndex++;
                }
            }
            // check if enough guests were created
            if (guestListTemplate.guestAmount !== guests.length) {
                console.error(`not enough guests were created. requested: ${guestListTemplate.guestAmount}, created: ${guests.length} `);
            }
            return guests;
        }
    });
}
function randomBirthday(eventDate, isAdult) {
    // NOTE : TypeScript Dates are annoying
    // adults bday cannot be later than the eventDate - 12 years
    let end = isAdult ? new Date(eventDate.getFullYear() - 12, eventDate.getMonth(), eventDate.getDate()) : eventDate;
    // childs bday cannot be before eventDate - 12 years
    let start = isAdult ? new Date("1920-01-01") : new Date(eventDate.getFullYear() - 12, eventDate.getMonth());
    // return a random date between start and end
    return randomDateBetween(start, end);
}
function randomDateBetween(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
class Section {
    constructor(rows, seats) {
        this.rows = 0;
        this.seats = 0;
        this.rows = rows;
        this.seats = seats;
    }
}
class EventModel {
    constructor(event, start, end) {
        this.sections = [];
        this._eventDate = event;
        this._saleEnd = end;
        this._saleStart = start;
    }
    get eventDate() {
        return this._eventDate;
    }
    set eventDate(value) {
        this._eventDate = value;
        this.eventStartDate = value.toLocaleDateString();
    }
    get saleStart() {
        return this._saleStart;
    }
    set saleStart(value) {
        this._saleStart = value;
        this.ticketSaleStart = value.toLocaleDateString();
    }
    get saleEnd() {
        return this._saleEnd;
    }
    set saleEnd(value) {
        this._saleEnd = value;
        this.ticketSaleEnd = value.toLocaleDateString();
    }
}
class GuestModel {
    constructor(name, dob, dateOfPurchase, groupCode = null) {
        this.groupCode = null;
        this.name = name;
        this._dateOfBirth = dob;
        this.groupCode = groupCode;
        this._dateOfPurchase = dateOfPurchase;
        this.dateOfBirth = this._dateOfBirth.toLocaleDateString();
        this.dateOfPurchase = this._dateOfPurchase.toLocaleDateString();
    }
}
class GuestListModel {
    constructor(total) {
        this._guestAmount = 0;
        this._groups = [];
        this.guestAmount = total;
    }
    get groups() {
        return this._groups;
    }
    set groupAmount(value) {
        if (value > 0) {
            this._groups.length = value;
            for (var i = 0; i < value; i++) {
                if (this._groups[i] == null) {
                    this._groups[i] = new GroupModel(2, 1);
                }
            }
        }
    }
    get groupAmount() {
        return this._groups.length;
    }
    // sum all totals of the specified group models
    get totalGroupGuests() {
        let total = 0;
        this._groups.forEach(g => {
            total += g.total;
        });
        return total;
    }
    get guestAmount() {
        return this._guestAmount;
    }
    // cap at minimum the total amount of guests specified by the defined groups
    set guestAmount(value) {
        let tga = this.totalGroupGuests;
        if (value < tga) {
            this._guestAmount = tga;
        }
        else {
            this._guestAmount = value;
        }
    }
    addGroup(total, adults) {
        this._groups.push(new GroupModel(total, adults));
    }
}
class GroupModel {
    constructor(t, a) {
        this._total = 0;
        this._adults = 0;
        // use setters to ensure logical construction
        this.total = t;
        this.adults = a;
    }
    get total() {
        return this._total;
    }
    set total(value) {
        // ensure the values are correct
        if (value < this._adults) {
            this._total = this._adults;
        }
        else {
            this._total = value;
        }
    }
    get adults() {
        return this._adults;
    }
    set adults(value) {
        // again enforce total as the hard cap
        if (value > this._total) {
            this._adults = this._total;
        }
        else {
            this._adults = value;
        }
    }
}
// deprecated
function RunTest() {
    console.log("starting test");
    let template = new GuestListModel(30);
    // add 3 groups
    template.addGroup(8, 1);
    template.addGroup(6, 2);
    template.addGroup(9, 5);
    console.log("template: ");
    console.log(template);
    let event = new EventModel(new Date("2022-4-20"), new Date("2022-1-20"), new Date("2022-4-13"));
    console.log("event: ");
    console.log(event);
    // run the 'prepare JSON' function asynchronously
    GenerateGuestListJson(template, event).then(guests => {
        console.log("guest list: ");
        console.log(guests);
    });
}
//# sourceMappingURL=GuestList.js.map