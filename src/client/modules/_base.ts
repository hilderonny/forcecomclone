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

    // Menu

    let mainMenuButton = new Button("Menü");
    mainMenuButton.HtmlElement.classList.add("mainmenubutton");
    webapp.toolBar.HtmlElement.appendChild(mainMenuButton.HtmlElement);
    webapp.toolBar.HtmlElement.addEventListener("click", () => {
        webapp.rootElement.classList.toggle("mainmenuopen");
    });

    webapp.mainMenu.addLoader(async (mainMenu) => {

        webapp.SubUrlHandlers = []; // Clean all handlers to reload them

        let mainMenuLogo = new Image("images/logo_avorium_komplett.svg");
        mainMenuLogo.HtmlElement.classList.add("logo");
        mainMenu.HtmlElement.appendChild(mainMenuLogo.HtmlElement);
    
        // Custom objects
    
        let userMenuSection = new Section();
        mainMenu.addSection(userMenuSection);
    
        let recordTypes = await webapp.api(RecordType).getAll();
        recordTypes.forEach((rt) => {
            if (!rt.showInMenu) return;
            let button = new Button(rt.label);
            let opener = () => {
                webapp.cardStack.closeAllCards();
                console.log(rt);
                mainMenu.select(button);
            };
            button.HtmlElement.addEventListener("click", opener);
            userMenuSection.addButton(button);

            webapp.addSubUrlHandler({
                UrlPart: rt.name + "/", 
                Handler: (subUrl) => {
                    opener();
                }
            });

        });
    
        // Section SETTINGS
    
        let settingsMenuSection = new Section();
        settingsMenuSection.HtmlElement.appendChild(new Title("Einstellungen").HtmlElement)
        mainMenu.addSection(settingsMenuSection);
    
        let customObjectsButton = new Button("Benutzerdefinierte Objekte", "categorize.png");
        let opener = (subUrl?: string) => {
            let customObjectListCard = new RecordTypeListCard(webapp);
            customObjectListCard.onClose = () => {
                mainMenu.select(undefined);
                webapp.setSubUrl("");
            };
            webapp.cardStack.closeAllCards();
            webapp.cardStack.addCard(customObjectListCard);
            mainMenu.select(customObjectsButton);

            // Check whether a record type was selected
            if (subUrl && subUrl.length > 11) {
                let id = subUrl.substring(11);
                customObjectListCard.select(id);
            }
        };
        customObjectsButton.HtmlElement.addEventListener("click", () => {
            opener();
        });
        settingsMenuSection.addButton(customObjectsButton);

        webapp.addSubUrlHandler({
            UrlPart: "RecordType/", 
            Handler: (subUrl) => {
                opener(subUrl);
            }
        });

        return Promise.resolve();
    });
    
});
    