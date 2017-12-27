import { Controller } from "./controller";
import { WebApp } from "../webapp";
import { MenuItem } from "../elements/mainmenu";
import { RecordType } from "../../common/types/recordtype";

export class CustomObjectController extends Controller {
    
    async initialize(webApp: WebApp): Promise<void> {
        webApp.mainMenu.menuHandlers.push({
            async load() {
                let menuItems: MenuItem[] = [];
    
                let recordTypes = await webApp.api(RecordType).getAll();
                recordTypes.forEach((rt) => {
                    if (!rt.showInMenu) return;
    
                    menuItems.push({
                        label: rt.label,
                        section: "",
                        onClick: async () => {
                            console.log("TODO: CLICK ON CUSTOM OBJECT");
                        }
                    });
                });
    
                return menuItems;
            }
    
        });
    }

}