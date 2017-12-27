import { AbstractElement } from "./abstractelement";
import { Image } from "../elements/image";
import { Button } from "./button";
import { WebApp } from "../webapp";
import { MenuSection } from "./menusection";
import { Title } from "./title";

export class MenuItem {
    label?: string;
    iconUrl?: string;
    subUrl?: string;
    section: string;
    onClick: (subUrl?: string) => Promise<void>;
}

export interface MenuHandler {
    load(): Promise<MenuItem[]>;
}

export class MainMenu extends AbstractElement {

    menuHandlers: MenuHandler[] = [];

    webApp: WebApp;

    constructor(webApp: WebApp) {
        super("div", "mainmenu");
        this.webApp = webApp;
    }

    public async load() {
        let self = this;
        self.HtmlElement.innerHTML = "";
        
        let mainMenuLogo = new Image("images/logo_avorium_komplett.svg");
        mainMenuLogo.HtmlElement.classList.add("logo");
        self.HtmlElement.appendChild(mainMenuLogo.HtmlElement);

        let promises: Promise<MenuItem[]>[] = [];
        let sections: { [key: string]: MenuSection } = { };
        let allButtons: Button[] = [];

        self.menuHandlers.forEach(async (menuHandler) => {
            promises.push(menuHandler.load());
        });

        let allHandlerMenuItems = await Promise.all(promises);
        allHandlerMenuItems.forEach((menuItemsOfOneHandler) => {
            menuItemsOfOneHandler.forEach((menuItem) => {
                let sectionLabel = menuItem.section;
                if (!sections[sectionLabel]) {
                    let menuSection = new MenuSection();
                    sections[sectionLabel] = menuSection;
                    menuSection.HtmlElement.appendChild(new Title(sectionLabel).HtmlElement);
                    self.HtmlElement.appendChild(menuSection.HtmlElement);
                }

                let button = new Button(menuItem.label, menuItem.iconUrl);
                allButtons.push(button);
                let classSwitcher = () => {
                    allButtons.forEach((b) => {
                        if (b !== button) b.HtmlElement.classList.remove("selected");
                    });
                    button.HtmlElement.classList.add("selected");
                };
                button.HtmlElement.addEventListener("click", () => {
                    classSwitcher();
                    menuItem.onClick(menuItem.subUrl);
                });
                sections[sectionLabel].HtmlElement.appendChild(button.HtmlElement);

                if (menuItem.subUrl) {
                    self.webApp.addSubUrlHandler({ // TODO: Das hier wird beim Ändern von Bezeichnungen von RecordTYpes mehrfach erzeugt, weil das Menü neu aufgebaut wird und somit neue Handler erstellt werden.
                        UrlPart: menuItem.subUrl,
                        Handler: (completeSubUrl) => {
                            classSwitcher();
                            menuItem.onClick(completeSubUrl);
                        }
                    });
                }
            });
        });
    }

}