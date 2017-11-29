import { App } from "./app"
import {CardStackType} from "./cardstack"

window.addEventListener("load", () => {
    
    let app = new App("body");

    app.setCardStackType(CardStackType.LISTDETAIL);
    app.addCard();
    app.addCard();
    app.addCard();
    app.addCard();
    
})