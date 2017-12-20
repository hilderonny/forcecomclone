import { CardStack } from "./cardstack";
import { AbstractElement } from "./abstractelement";
import { Title } from "./title";
import { Button } from "./button";
import { ResizeHandle } from "./resizehandle";
import { WebApp } from "../webapp";

/**
 * This is a card contained in a cardstack.
 */
export class Card extends AbstractElement {

    protected webApp: WebApp;
    
    ResizeHandle: ResizeHandle;

    Title: Title;

    CloseButton: Button;

    BeforeClose: (card: Card) => void;
    
    handleCloseClick: (mouseClickEvent: MouseEvent) => void;

    onClose: () => void;
    
    /**
     * Creates a card and assigns it to the given card stack
     */
    constructor(webApp: WebApp, title?: string) {
        super("div", "card");
        let self = this;

        self.webApp = webApp;

        self.ResizeHandle = new ResizeHandle();
        this.HtmlElement.appendChild(self.ResizeHandle.HtmlElement);

        self.CloseButton = new Button(undefined, "delete.png");
        self.handleCloseClick = (mouseClickEvent: MouseEvent) => {
            self.close();
        };
        self.CloseButton.HtmlElement.classList.add("closebutton");
        self.CloseButton.HtmlElement.addEventListener("click", self.handleCloseClick);
        this.HtmlElement.appendChild(self.CloseButton.HtmlElement);
        
        if (title !== undefined) {
            this.Title = new Title(title);
            this.HtmlElement.appendChild(this.Title.HtmlElement);
        }

    }

    close() {
        if (this.BeforeClose) this.BeforeClose(this);
        if (this.HtmlElement.parentElement) this.HtmlElement.parentElement.removeChild(this.HtmlElement);
        this.HtmlElement.innerHTML = ""; // Force garbage collection
        if (this.onClose) this.onClose();
    }

}