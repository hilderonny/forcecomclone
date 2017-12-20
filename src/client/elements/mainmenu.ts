import { AbstractElement } from "./abstractelement";
import { Section } from "./section";
import { Button } from "./button";

export class MainMenu extends AbstractElement {

    Sections: Section[] = [];
    
    private loaders: ((mainMenu: MainMenu) => void)[] = [];

    constructor() {
        super("div", "mainmenu");
    }

    addSection(section: Section) {
        this.HtmlElement.appendChild(section.HtmlElement);
        this.Sections.push(section);
    }

    public addLoader(loader: (mainMenu: MainMenu) => void) {
        this.loaders.push(loader);
    }

    public load() {
        let self = this;
        self.HtmlElement.innerHTML = "";
        self.loaders.forEach((loader) => {
            loader(self);
        });
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