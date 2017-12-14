import { ClientModule } from "../clientmodule";
import { Button } from "../elements/button";
import { Image } from "../elements/image";
import { Section } from "../elements/section";
import { Title } from "../elements/title";
import { Card } from "../elements/card";

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

    let userMenuSection = new Section();
    webapp.mainMenu.HtmlElement.appendChild(userMenuSection.HtmlElement);


    let settingsMenuSection = new Section();
    settingsMenuSection.HtmlElement.appendChild(new Title("Einstellungen").HtmlElement)
    webapp.mainMenu.HtmlElement.appendChild(settingsMenuSection.HtmlElement);

    let customObjectsButton = new Button("Benutzerdefinierte Objekte", "categorize.png");
    customObjectsButton.HtmlElement.addEventListener("click", () => {
        let customObjectListCard = new Card("Benutzerdefinierte Objekte");
        webapp.cardStack.closeAllCards();
        webapp.cardStack.addCard(customObjectListCard);
        
    });
    settingsMenuSection.HtmlElement.appendChild(customObjectsButton.HtmlElement);
    
    webapp.cardStack.addCard(new Card("this .HtmlElement. appendChild( self. CloseButton. HtmlElement);")); // TODO: Remove, dummy stuff
    webapp.cardStack.addCard(new Card("2")); // TODO: Remove, dummy stuff
    webapp.cardStack.addCard(new Card("3")); // TODO: Remove, dummy stuff
});
    