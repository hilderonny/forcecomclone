import { DetailsCardProperty } from "./detailscard";
import { Property } from "./property";

export class CheckBoxProperty extends Property {

    Property: DetailsCardProperty;
    
    constructor(property: DetailsCardProperty) {
        super(property);
        
        let self = this;
        self.HtmlElement.classList.add("checkboxproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        self.addChild(label);
        
        let input = document.createElement("input") as HTMLInputElement;
        input.setAttribute("type", "checkbox");
        label.appendChild(input);
        input.checked = property.Value;

        let span = document.createElement("span") as HTMLSpanElement;
        span.innerHTML = property.Label;
        label.appendChild(span);

        let changeHandler = () => {
            self.Property.Value = input.checked;
        };
        input.addEventListener("change", changeHandler);

    }

}