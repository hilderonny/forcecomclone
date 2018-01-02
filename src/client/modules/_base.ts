import { ClientModule } from "../clientmodule";
import { Button } from "../elements/button";
import { RecordTypeController } from "../controllers/recordtypecontroller";
import { CustomObjectController } from "../controllers/customobjectcontroller";

export default ClientModule.create(async (webApp) => {

    // Menu button in title bar

    let mainMenuButton = new Button("Menü");
    mainMenuButton.HtmlElement.classList.add("mainmenubutton");
    webApp.toolBar.HtmlElement.appendChild(mainMenuButton.HtmlElement);
    webApp.toolBar.HtmlElement.addEventListener("click", () => {
        webApp.rootElement.classList.toggle("mainmenuopen");
    });

    // Controllers for custom objects and record types
    await new CustomObjectController().initialize(webApp);
    await new RecordTypeController().initialize(webApp);
    
});
    