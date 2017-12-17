import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { DetailsCardProperty } from "./detailscard";

export class Property extends AbstractElement {

    Property: DetailsCardProperty;

    constructor(property: DetailsCardProperty) {
        super("div", "property");

        let self = this;
        self.Property = property;

    }

}