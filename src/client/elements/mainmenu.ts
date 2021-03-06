import { AbstractElement } from "./abstractelement";
import { Image } from "../elements/image";
import { Button } from "./button";
import { WebApp } from "../webapp";
import { Title } from "./title";
import { ListSection, ListElement } from "./section";

export class MenuItem {
    label?: string;
    iconUrl?: string;
    subUrl?: string;
    section: string;
    select?: () => void;
    listElement?: ListElement<any>;
    onClick: (menuItem: MenuItem) => Promise<void>;
    dataObject?: any;
}

export interface MenuHandler {
    load(): Promise<MenuItem[]>;
}

export class MainMenu extends AbstractElement {

    menuHandlers: MenuHandler[] = [];

    webApp: WebApp;

    sections: { [key: string]: { menuItems: MenuItem[], listSection: ListSection<any> } };

    constructor(webApp: WebApp) {
        super("div", "mainmenu");
        this.webApp = webApp;
    }

    unselect() {
        let self = this;
        Object.keys(self.sections).forEach((sectionLabel) => {
            self.sections[sectionLabel].listSection.select();
        });
    }

    public async load() {
        let self = this;
        self.HtmlElement.innerHTML = "";
        
        let mainMenuLogo = new Image("images/logo_avorium_komplett.svg");
        mainMenuLogo.HtmlElement.classList.add("logo");
        self.HtmlElement.appendChild(mainMenuLogo.HtmlElement);

        self.sections = {};

        let promises: Promise<MenuItem[]>[] = [];

        self.menuHandlers.forEach(async (menuHandler) => {
            promises.push(menuHandler.load());
        });

        let allHandlerMenuItems = await Promise.all(promises);
        allHandlerMenuItems.forEach((menuItemsOfOneHandler) => {
            menuItemsOfOneHandler.forEach((menuItem) => {
                let sectionLabel = menuItem.section;
                menuItem.select = () => {
                    Object.keys(self.sections).forEach((sectionLabel) => {
                        let listSection = self.sections[sectionLabel].listSection;
                        let listElement = listSection.listElements.find((le) => {
                            return le.entity === menuItem;
                        });
                        listSection.list.select(listElement ? listElement.button : undefined);
                    });
                };
                if (!self.sections[sectionLabel]) {
                    let sectionObject: { menuItems: MenuItem[], listSection: ListSection<any> } = {
                        menuItems: [] as MenuItem[],
                        listSection: new ListSection<any>({
                            sectionTitle: sectionLabel,
                            loadListElements: async () => {
                                return sectionObject.menuItems.map((mi) => { 
                                    let listElement = {
                                        entity: mi,
                                        firstLine: mi.label,
                                        iconUrl: mi.iconUrl
                                    } as ListElement<any>;
                                    mi.listElement = listElement;
                                    return listElement;
                                });
                            },
                            onSelect: async (listElement) => {
                                await menuItem.onClick(listElement.entity);
                                menuItem.select!();
                            }
                        })
                    };
                    self.sections[sectionLabel] = sectionObject;
                    self.HtmlElement.appendChild(sectionObject.listSection.HtmlElement);
                }
                let sectionObject = self.sections[sectionLabel];
                sectionObject.menuItems.push(menuItem);

                if (menuItem.subUrl) {
                    self.webApp.addSubUrlHandler({
                        UrlPart: menuItem.subUrl,
                        Handler: (completeSubUrl) => {
                            menuItem.select!();
                        }
                    });
                }
            });
        });

        let voidPromises: Promise<void>[] = [];
        Object.keys(self.sections).forEach(async (sectionLabel) => {
            voidPromises.push(self.sections[sectionLabel].listSection.load());
        });
        await Promise.all(voidPromises);

    }

}