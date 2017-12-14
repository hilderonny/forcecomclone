import { CardStack } from "./cardstack";
import { AbstractElement } from "./abstractelement";

/**
 * This is a card contained in a cardstack.
 */
export class Card extends AbstractElement {

    /**
     * When starting card resizing this variable remembers the starting X
     * position of the cursor
     */
    ResizeStartX: number;
    
    /**
     * When starting card resizing this variable remembers the starting width
     * of the card
     */
    ResizeStartWidth: number;

    handleResizeDrag: (resizeDragEvent: MouseEvent) => void;

    handleResizeEnd: (resizeEndEvent: MouseEvent) => void;

    handleMouseDown: (mouseDownEvent: MouseEvent) => void;
    
    /**
     * Creates a card and asings it to the given card stack
     */
    constructor() {
        super("div", "card");
        let self = this;
        // Initialize resize behaviour of card in list-detail-mode
        // See https://jsfiddle.net/ronnyhildebrandt/2rez90co/ for detailed example
        self.handleMouseDown = (mouseDownEvent: MouseEvent) => {
            self.handleResizeDrag = (resizeDragEvent: MouseEvent) => {
                // Dragging the resize handle
                let delta = resizeDragEvent.pageX - self.ResizeStartX;
                let width = (self.ResizeStartWidth + delta) + 'px';
                self.HtmlElement.style.minWidth = width;
                resizeDragEvent.preventDefault();
                return false;
            }
            self.handleResizeEnd = (resizeEndEvent: MouseEvent) => {
                document.removeEventListener("mousemove", self.handleResizeDrag);
                document.removeEventListener("mouseup", self.handleResizeEnd);
            }
            document.addEventListener("mousemove", self.handleResizeDrag);
            document.addEventListener("mouseup", self.handleResizeEnd);
            self.ResizeStartX = mouseDownEvent.pageX;
            self.ResizeStartWidth = self.HtmlElement.offsetWidth;
        };
        this.HtmlElement.addEventListener("mousedown", self.handleMouseDown);
    }

    close() {
        this.HtmlElement.removeEventListener("mousedown", this.handleMouseDown);
        if (this.HtmlElement.parentElement) this.HtmlElement.parentElement.removeChild(this.HtmlElement);
    }

}