import { AbstractElement } from "./abstractelement";

export class ResizeHandle extends AbstractElement {

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

    constructor() {
        super("div", "resizehandle");
        let self = this;
        // Initialize resize behaviour of card in list-detail-mode
        // See https://jsfiddle.net/ronnyhildebrandt/2rez90co/ for detailed example
        let handleMouseDown = (mouseDownEvent: MouseEvent) => {
            let handleResizeDrag = (resizeDragEvent: MouseEvent) => {
                // Dragging the resize handle
                let delta = resizeDragEvent.pageX - self.ResizeStartX;
                let width = (self.ResizeStartWidth + delta) + 'px';
                self.HtmlElement.parentElement!.style.minWidth = width;
                self.HtmlElement.parentElement!.style.width = width;
                resizeDragEvent.preventDefault();
                return false;
            }
            let handleResizeEnd = (resizeEndEvent: MouseEvent) => {
                document.removeEventListener("mousemove", handleResizeDrag);
                document.removeEventListener("mouseup", handleResizeEnd);
            }
            document.addEventListener("mousemove", handleResizeDrag);
            document.addEventListener("mouseup", handleResizeEnd);
            self.ResizeStartX = mouseDownEvent.pageX;
            self.ResizeStartWidth = self.HtmlElement.parentElement!.offsetWidth;
            mouseDownEvent.preventDefault();
            return false;
    };
        this.HtmlElement.addEventListener("mousedown", handleMouseDown);
    }

}