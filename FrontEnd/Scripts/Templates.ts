// creates a single element from a template and adds it as a child of the targetContainer
function LoadFromTemplate(templateId: string, data: any): string {
    // find the template
    var itemTpl = $('script[data-template="' + templateId + '"]').text().split(/\$\{(.+?)\}/g);

    // render the properties into the placeholders within the template
    let render = props => {
        return function (tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    // convert the rendered template from string to HTMLElement
    return new DOMParser().parseFromString(itemTpl.map(render(data)).join(''), "text/html").body.innerHTML;
}

const host: string = window.location.protocol + "//" + window.location.host;