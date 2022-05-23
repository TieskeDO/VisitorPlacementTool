// when the selected dataset changes get the json data
$('#datasetSelector').change(x => {
    $('#datasetSelector').prop('enabled', false);
    
    // get the file name
    let fileName: string = $('#' + x.target.id).val().toString();

    // get the json data
    $.get(host + "/DataSet/Read", { fileName: fileName }, data => {

        console.log(data);

        // clear the current seating plan
        const sectionContainer = $('#seatingVisuals');
        sectionContainer.empty();

        // create the sections
        for (let i: number = 0; i < data.event.sections.length; i++) {
            let sectionData: Section = data.event.sections[i];
            let sectionElement: HTMLElement = document.createElement('div');
            let sectionLabel: string = intToAlphabet(i + 1);

            // set the styling
            sectionElement.id = "section-" + sectionLabel;
            sectionElement.classList.add('section');
            sectionElement.setAttribute('style', 'grid-template-columns: repeat(' + sectionData.seats + ', 1fr);');

            // add the rows and seats
            for (let row: number = 0; row < sectionData.rows; row++) {
                let rowId: number = row + 1;

                for (let seat: number = 0; seat < sectionData.seats; seat++) {
                    let seatElement: HTMLElement = document.createElement('div');
                    let seatingId: number = seat + 1;

                    seatElement.id = sectionLabel + rowId + '-' + seatingId;
                    seatElement.classList.add('seat');

                    // add the seat to the section
                    sectionElement.append(seatElement);
                }
            }

            // add the section to the section container
            sectionContainer.append(sectionElement);
        }

    }).fail(xhr => {
        console.log(xhr);
    })

    $('#datasetSelector').prop('enabled', true);

})

function intToAlphabet(num) {
    let s = '', t;

    while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t) / 26 | 0;
    }
    return s || undefined;
}

// create an html element that represents the seats
