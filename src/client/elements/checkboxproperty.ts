import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { DetailsCardProperty } from "./detailscard";
import { Property } from "./property";

export class CheckBoxProperty extends Property {

    Property: DetailsCardProperty;

    constructor(property: DetailsCardProperty) {
        super(property);
        
        let self = this;
        self.HtmlElement.classList.add("checkboxproperty");
        
        let input = document.createElement("input") as HTMLInputElement;
        input.setAttribute("type", "checkbox");
        self.HtmlElement.appendChild(input);
        input.checked = property.Value;

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = property.Label;
        self.HtmlElement.appendChild(label);

        let changeHandler = () => {
            self.Property.Value = input.checked;
        };
        input.addEventListener("change", changeHandler);

        self.HtmlElement.addEventListener("click", () => {
            input.checked = !input.checked;
            changeHandler();
        });

    }

}