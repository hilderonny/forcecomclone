import { WebApp } from "./webapp"
import {CardStackType} from "./elements/cardstack"
import { Card } from "./elements/card";

/**
 * Initilize the client side of the app when the page was loaded
 * and shows first content.
 */

window.addEventListener("load", () => {
    
    let webapp = new WebApp("body");

    webapp.cardStack.setType(CardStackType.LISTDETAIL);
    
});