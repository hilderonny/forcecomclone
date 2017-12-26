import { ClientModule } from "../clientmodule";
import { Button } from "../elements/button";
import { Image } from "../elements/image";
import { MenuSection } from "../elements/menusection";
import { Title } from "../elements/title";
import { Card } from "../elements/card";
import { ListCard } from "../elements/listcard";
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
    
        let userMenuSection = new MenuSection();
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
    
        let settingsMenuSection = new MenuSection();
        settingsMenuSection.HtmlElement.appendChild(new Title("Einstellungen").HtmlElement)
        mainMenu.addSection(settingsMenuSection);
    
        let recordTypesButton = new Button("Benutzerdefinierte Objekte", "categorize.png");
        let opener = async (subUrl?: string) => {
            let recordTypesListCard = new RecordTypeListCard(webapp);
            recordTypesListCard.onClose = () => {
                mainMenu.select(undefined);
                webapp.setSubUrl("");
            };
            webapp.cardStack.closeAllCards();
            await recordTypesListCard.load();
            webapp.cardStack.addCard(recordTypesListCard);
            mainMenu.select(recordTypesButton);

            // Check whether a record type was selected
            if (subUrl && subUrl.length > 11) {
                let id = subUrl.substring(11);
                recordTypesListCard.select(id);
            }
        };
        recordTypesButton.HtmlElement.addEventListener("click", () => {
            opener();
        });
        settingsMenuSection.addButton(recordTypesButton);

        webapp.addSubUrlHandler({
            UrlPart: "RecordType/", 
            Handler: (subUrl) => {
                opener(subUrl);
            }
        });

        return Promise.resolve();
    });
    
});
    