import { Property } from "./property";
import { PropertyElement } from "./section";

export class SelectBoxProperty extends Property {

    constructor(propertyElement: PropertyElement) {
        super(propertyElement);

        let self = this;
        self.HtmlElement.classList.add("selectboxproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = propertyElement.label;
        label.style.visibility = "visible";
        self.addChild(label);

        let select = document.createElement("select") as HTMLSelectElement;
        self.addChild(select);
        
        propertyElement.options!.forEach((option) => {
            let optionElement = document.createElement("option") as HTMLOptionElement;
            optionElement.value = option;
            optionElement.innerHTML = option;
            if (option === propertyElement.value) optionElement.selected = true;
            select.appendChild(optionElement);
        });

        let changeHandler = () => {
            self.propertyElement.value = select.value;
        };

        select.addEventListener("change", changeHandler);
        
    }

}
