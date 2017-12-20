import { AbstractElement } from "./abstractelement";

export class MainMenu extends AbstractElement {

    private loaders: ((mainMenu: MainMenu) => void)[] = [];

    constructor() {
        super("div", "mainmenu");
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

}