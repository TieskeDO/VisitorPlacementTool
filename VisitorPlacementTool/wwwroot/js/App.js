function GenerateGuestListJson(guestListTemplate, event) {
    // find out how many individual guests need to be created
    var indivGuests = guestListTemplate.guestAmount - guestListTemplate.totalGroupGuests;
    // initialize empty array to push newly created guests to
    var guests = [];
    // retrieve random names from api
    var apiResonse = null;
    $.post("https://randomuser.me/api/?inc=gender,name&results=" + guestListTemplate.guestAmount)
        .done(function (data) {
        apiResonse = data;
    })
        .fail(function (err) {
        console.log(err);
        alert("Name fetch failed, server returned : " + err.responseText);
    });
    // validate succesfull api retrieval
    if (apiResonse !== null && apiResonse.results.info.results === guestListTemplate.guestAmount) {
        // create a variable only holding the name and age of each api result
        var apiNames = apiResonse.results;
        // initialize i outside of for-loop so the itterator count can be shared when creating groups
        var nameIndex = void 0;
        // create a guestModel for all individual attendees
        for (nameIndex = 0; nameIndex < indivGuests; nameIndex++) {
            var name_1 = apiNames[nameIndex].name;
            var dob = randomBirthday(event.eventDate, true);
            // add a new guest without a groupCode
            guests.push(new GuestModel("".concat(name_1.title, " ").concat(name_1.first, " ").concat(name_1.last), dob, randomDateBetween(event.saleStart, event.saleEnd)));
        }
        // start adding the groups
        for (var g = 0; g < guestListTemplate.groups.length; g++) {
            var group = guestListTemplate.groups[g];
            var groupCode = "gr-".concat(g + 1);
            // loop over all group members
            for (var groupMember = 0; groupMember < group.total; groupMember++) {
                var name_2 = apiNames[nameIndex].name;
                // check if guest should be an adult
                var isAdult = groupMember < group.adults;
                var dob = randomBirthday(event.eventDate, isAdult);
                // add a new guest without a groupCode
                guests.push(new GuestModel("".concat(name_2.title, " ").concat(name_2.first, " ").concat(name_2.last), dob, randomDateBetween(event.saleStart, event.saleEnd), // purchase date is still random per member
                groupCode // add the groupcode for each member
                ));
            }
        }
        // check if enough guests were created
        if (guestListTemplate.guestAmount !== guests.length) {
            console.error("not enough guests were created. requested: ".concat(guestListTemplate.guestAmount, ", created: ").concat(guests.length, " "));
        }
    }
    return guests;
}
function randomBirthday(eventDate, isAdult) {
    // NOTE : TypeScript Dates are annoying
    // adults bday cannot be later than the eventDate - 12 years
    var end = isAdult ? new Date(eventDate.getFullYear() - 12, eventDate.getMonth(), eventDate.getDate()) : eventDate;
    // childs bday cannot be before eventDate - 12 years
    var start = isAdult ? new Date("1920-01-01") : new Date(eventDate.getFullYear() - 12, eventDate.getMonth());
    // return a random date between start and end
    return randomDateBetween(start, end);
}
function randomDateBetween(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
var EventModel = /** @class */ (function () {
    function EventModel(event, start, end) {
        this.eventDate = event;
        this.saleEnd = end;
        this.saleStart = start;
    }
    return EventModel;
}());
var GuestModel = /** @class */ (function () {
    function GuestModel(name, dob, dateOfPurchase, groupCode) {
        if (groupCode === void 0) { groupCode = null; }
        this.groupCode = null;
        this.name = name;
        this.dateOfBirth = dob;
        this.groupCode = groupCode;
        this.dateOfPurchase = dateOfPurchase;
    }
    return GuestModel;
}());
var GuestListModel = /** @class */ (function () {
    function GuestListModel(total) {
        this._guestAmount = 0;
        this.guestAmount = total;
    }
    Object.defineProperty(GuestListModel.prototype, "groups", {
        get: function () {
            return this._groups;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GuestListModel.prototype, "totalGroupGuests", {
        // sum all totals of the specified group models
        get: function () {
            var total = 0;
            this._groups.forEach(function (g) {
                total += g.total;
            });
            return total;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GuestListModel.prototype, "guestAmount", {
        get: function () {
            return this._guestAmount;
        },
        // cap at minimum the total amount of guests specified by the defined groups
        set: function (value) {
            var tga = this.totalGroupGuests;
            if (value < tga) {
                this._guestAmount = tga;
            }
            else {
                this._guestAmount = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    GuestListModel.prototype.addGroup = function (total, adults) {
        this._groups.push(new GroupModel(total, adults));
    };
    return GuestListModel;
}());
var GroupModel = /** @class */ (function () {
    function GroupModel(t, a) {
        this._total = 0;
        this._adults = 0;
        // use setters to ensure logical construction
        this.total = t;
        this.adults = a;
    }
    Object.defineProperty(GroupModel.prototype, "total", {
        get: function () {
            return this._total;
        },
        set: function (value) {
            // ensure the values are correct
            if (value < this._adults) {
                this._total = this._adults;
            }
            else {
                this._total = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GroupModel.prototype, "adults", {
        get: function () {
            return this._adults;
        },
        set: function (value) {
            // again enforce total as the hard cap
            if (value > this._total) {
                this._adults = this._total;
            }
            else {
                this._adults = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    return GroupModel;
}());
function RunTest() {
    console.log("starting test");
    var template = new GuestListModel(30);
    // add 3 groups
    template.addGroup(8, 1);
    template.addGroup(6, 2);
    template.addGroup(9, 5);
    console.log("template: ");
    console.log(template);
    var event = new EventModel(new Date("2022-4-20"), new Date("2022-1-20"), new Date("2022-4-13"));
    console.log("event: ");
    console.log(event);
    // run the 'prepare JSON' function
    var guests = GenerateGuestListJson(template, event);
    console.log("guest list: ");
    console.log(guests);
}
//# sourceMappingURL=App.js.map