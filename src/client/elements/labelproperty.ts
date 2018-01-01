import { Property } from "./property";
import { PropertyElement } from "./section";

export class LabelProperty extends Property {

    constructor(propertyElement: PropertyElement) {
        super(propertyElement);

        let self = this;
        self.HtmlElement.classList.add("labelproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = propertyElement.label;
        self.addChild(label);

        let span = document.createElement("span") as HTMLSpanElement;
        self.addChild(span);
        span.innerHTML = propertyElement.value === undefined ? "" : propertyElement.value;

    }

}