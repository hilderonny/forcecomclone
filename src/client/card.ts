import { CardStack } from "./cardstack";

/**
 * This is a card contained in a cardstack.
 */
export class Card {

    /**
     * Reference to the underlying DIV element for DOM manipulations
     */
    DivElement: HTMLDivElement;

    private ResizeStartX: number;
    private ResizeStartWidth: number;

    /**
     * Creates a card and asings it to the given card stack
     */
    constructor() {
        this.DivElement = document.createElement("div");
        this.DivElement.classList.add("card");
        let self = this;
        // Initialize resize behaviour of card in list-detail-mode
        // See https://jsfiddle.net/ronnyhildebrandt/2rez90co/ for detailed example
        this.DivElement.addEventListener("mousedown", function(evt) {
            let handleResizeDrag = (evt: MouseEvent) => {
                // Dragging the resize handle
                let delta = evt.pageX - self.ResizeStartX;
                let width = (self.ResizeStartWidth + delta) + 'px';
                self.DivElement.style.minWidth = width;
                evt.preventDefault();
                return false;
            }
            let handleResizeEnd = (evt: MouseEvent) => {
                document.removeEventListener("mousemove", handleResizeDrag);
                document.removeEventListener("mouseup", handleResizeEnd);
            }
            document.addEventListener("mousemove", handleResizeDrag);
            document.addEventListener("mouseup", handleResizeEnd);
            self.ResizeStartX = evt.pageX;
            self.ResizeStartWidth = self.DivElement.offsetWidth;
        });
    }

}