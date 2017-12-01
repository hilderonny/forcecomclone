import { WebApp } from "./webapp"
import {CardStackType} from "./cardstack"

window.addEventListener("load", () => {
    
    let webapp = new WebApp("body");

    

    webapp.setCardStackType(CardStackType.LISTDETAIL);
    webapp.addCard();
    
})