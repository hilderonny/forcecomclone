import { ClientModule } from "../clientmodule";
import { User } from "../../common/types/user";

export default ClientModule.create((webapp) => {
    console.log("Module 1");
    webapp.addCard();

    webapp.addStatusHandler(404, (req) => {
        console.log(req.statusText);
        return false;
    });

    webapp.api(User).getAll().then((users) => {
        console.log(users);
    });
    
});
    