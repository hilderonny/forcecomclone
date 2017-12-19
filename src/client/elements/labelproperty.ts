import { DetailsCardProperty } from "./detailscard";
import { Property } from "./property";

export class LabelProperty extends Property {


    constructor(property: DetailsCardProperty) {
        super(property);

        let self = this;
        self.HtmlElement.classList.add("labelproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = property.Label;
        self.HtmlElement.appendChild(label);

        let span = document.createElement("span") as HTMLSpanElement;
        self.HtmlElement.appendChild(span);
        span.innerHTML = property.Value;

    }

}