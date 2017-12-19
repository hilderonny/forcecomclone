import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { DetailsCardProperty } from "./detailscard";

export abstract class Property extends AbstractElement {

    private errorDiv: HTMLDivElement;
    Property: DetailsCardProperty;
    
    setErrorMessage(errorMessage: string | null): void {
        if (errorMessage) {
            this.HtmlElement.classList.add("haserror");
            this.errorDiv.innerHTML = errorMessage;
        } else {
            this.HtmlElement.classList.remove("haserror");
            this.errorDiv.innerHTML = "";
        }
    }

    constructor(property: DetailsCardProperty) {
        super("div", "property");

        let self = this;
        self.Property = property;

        property.Property = self; // For error messages

        self.errorDiv = document.createElement("div") as HTMLDivElement;
        self.errorDiv.classList.add("errormessage");
        self.HtmlElement.appendChild(self.errorDiv);
        
    }

    protected addChild(htmlElement: HTMLElement) {
        // Put before error div
        this.HtmlElement.insertBefore(htmlElement, this.errorDiv);
    }

}