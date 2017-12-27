import { Property } from "./property";
import { PropertyElement } from "./section";

export class CheckBoxProperty extends Property {
    
    constructor(propertyElement: PropertyElement) {
        super(propertyElement);
        
        let self = this;
        self.HtmlElement.classList.add("checkboxproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        self.addChild(label);
        
        let input = document.createElement("input") as HTMLInputElement;
        input.setAttribute("type", "checkbox");
        label.appendChild(input);
        input.checked = propertyElement.value;

        let span = document.createElement("span") as HTMLSpanElement;
        span.innerHTML = propertyElement.label;
        label.appendChild(span);

        let changeHandler = () => {
            propertyElement.value = input.checked;
        };
        input.addEventListener("change", changeHandler);

    }

}