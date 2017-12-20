import { ClientModule } from "../clientmodule";
import { Button } from "../elements/button";
import { Image } from "../elements/image";
import { Section } from "../elements/section";
import { Title } from "../elements/title";
import { Card } from "../elements/card";
import { ListCard, ListCardElementViewModel } from "../elements/listcard";
import { RecordTypeListCard } from "../elements/recordtypelistcard";
import { RecordType } from "../../common/types/recordtype";

export default ClientModule.create((webapp) => {

    let mainMenuButton = new Button("Menü");
    mainMenuButton.HtmlElement.classList.add("mainmenubutton");
    webapp.toolBar.HtmlElement.appendChild(mainMenuButton.HtmlElement);
    webapp.toolBar.HtmlElement.addEventListener("click", () => {
        webapp.rootElement.classList.toggle("mainmenuopen");
    });

    let mainMenuLogo = new Image("images/logo_avorium_komplett.svg");
    mainMenuLogo.HtmlElement.classList.add("logo");
    webapp.mainMenu.HtmlElement.appendChild(mainMenuLogo.HtmlElement);

    // Custom objects

    let userMenuSection = new Section();
    webapp.mainMenu.HtmlElement.appendChild(userMenuSection.HtmlElement);

    webapp.api(RecordType).getAll().then((recordTypes) => {
        recordTypes.forEach((rt) => {
            if (!rt.showInMenu) return;
            let button = new Button(rt.label);
            button.HtmlElement.addEventListener("click", () => {
                webapp.cardStack.closeAllCards();
                console.log(rt);
            });
            userMenuSection.HtmlElement.appendChild(button.HtmlElement);
        });
    });

    // Section SETTINGS

    let settingsMenuSection = new Section();
    settingsMenuSection.HtmlElement.appendChild(new Title("Einstellungen").HtmlElement)
    webapp.mainMenu.HtmlElement.appendChild(settingsMenuSection.HtmlElement);

    let customObjectsButton = new Button("Benutzerdefinierte Objekte", "categorize.png");
    customObjectsButton.HtmlElement.addEventListener("click", () => {
        let customObjectListCard = new RecordTypeListCard(webapp);
        webapp.cardStack.closeAllCards();
        webapp.cardStack.addCard(customObjectListCard);
    });
    settingsMenuSection.HtmlElement.appendChild(customObjectsButton.HtmlElement);

    
});
    