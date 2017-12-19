import { DetailsCardProperty } from "./detailscard";
import { Property } from "./property";

export class TextProperty extends Property {


    constructor(property: DetailsCardProperty) {
        super(property);

        let self = this;
        self.HtmlElement.classList.add("textproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = property.Label;
        self.HtmlElement.appendChild(label);

        let input = document.createElement("input") as HTMLInputElement;
        self.HtmlElement.appendChild(input);
        input.setAttribute("placeholder", property.Label);

        let changeHandler = () => {
            self.Property.Value = input.value;
            label.style.visibility = input.value.length > 0 ? "visible" : "hidden";
        };
        input.value = property.Value;
        changeHandler();
        input.addEventListener("change", changeHandler);
        input.addEventListener("keyup", changeHandler);

    }

}