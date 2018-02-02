import { Property } from "./property";
import { PropertyElement } from "./section";

export class TextProperty extends Property {

    constructor(propertyElement: PropertyElement) {
        super(propertyElement);

        let self = this;
        self.HtmlElement.classList.add("textproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = propertyElement.label;
        self.addChild(label);

        let input = document.createElement("input") as HTMLInputElement;
        self.addChild(input);
        input.setAttribute("placeholder", propertyElement.label);

        let changeHandler = () => {
            self.propertyElement.value = input.value;
            label.style.visibility = input.value.length > 0 ? "visible" : "hidden";
        };
        input.value = propertyElement.value === undefined ? "" : propertyElement.value;
        changeHandler();
        input.addEventListener("change", changeHandler);
        input.addEventListener("keyup", changeHandler);
        
    }

}