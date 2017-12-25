import { AbstractElement } from "./abstractelement";
import { MenuSection } from "./menusection";
import { Button } from "./button";

export class MainMenu extends AbstractElement {

    Sections: MenuSection[] = [];
    
    private loaders: ((mainMenu: MainMenu) => Promise<void>)[] = [];

    constructor() {
        super("div", "mainmenu");
    }

    addSection(section: MenuSection) {
        this.HtmlElement.appendChild(section.HtmlElement);
        this.Sections.push(section);
    }

    public addLoader(loader: (mainMenu: MainMenu) => Promise<void>) {
        this.loaders.push(loader);
    }

    public async load() {
        let self = this;
        self.HtmlElement.innerHTML = "";
        let promises: Promise<void>[] = [];
        self.loaders.forEach((loader) => {
            promises.push(loader(self));
        });
        return Promise.all(promises);
    }

    select(button?: Button) {
        this.Sections.forEach((section) => {
            section.Buttons.forEach((b) => {
                if (b !== button) {
                    b.HtmlElement.classList.remove("selected");
                }
            });
        });
        if (button) button.HtmlElement.classList.add("selected");
    }

}