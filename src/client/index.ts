import { WebApp } from "./webapp"
import {CardStackType} from "./cardstack"

/**
 * Initilize the client side of the app when the page was loaded
 * and shows first content.
 */

window.addEventListener("load", () => {
    
    let webapp = new WebApp("body");

    webapp.setCardStackType(CardStackType.LISTDETAIL);
    webapp.addCard();
    
})