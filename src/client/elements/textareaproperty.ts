import { Property } from "./property";
import { PropertyElement } from "./section";

export class TextAreaProperty extends Property {

    constructor(propertyElement: PropertyElement) {
        super(propertyElement);

        let self = this;
        self.HtmlElement.classList.add("textareaproperty");

        let label = document.createElement("label") as HTMLLabelElement;
        label.innerHTML = propertyElement.label;
        self.addChild(label);

        let textArea = document.createElement("textarea") as HTMLTextAreaElement;
        self.addChild(textArea);
        textArea.setAttribute("placeholder", propertyElement.label);

        let changeHandler = () => {
            self.propertyElement.value = textArea.value;
            label.style.visibility = textArea.value.length > 0 ? "visible" : "hidden";
        };
        textArea.value = propertyElement.value === undefined ? "" : propertyElement.value;
        changeHandler();
        textArea.addEventListener("change", changeHandler);
        textArea.addEventListener("keyup", changeHandler);
        
    }

}