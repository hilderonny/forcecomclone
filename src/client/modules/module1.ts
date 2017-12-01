import { ClientModule } from "../clientmodule";

export default ClientModule.create((webapp) => {
    console.log("Module 1");
    webapp.addCard();
});
    