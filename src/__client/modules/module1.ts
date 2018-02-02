import { ClientModule } from "../clientmodule";
import { User } from "../../common/types/user";

export default ClientModule.create(async (webapp) => {
    // console.log("Module 1");
    // webapp.cardStack.addCard();

    // webapp.rest.addStatusHandler(404, (req) => {
    //     console.log(req.statusText);
    //     return false;
    // });

    // webapp.api(User).save({ name: "Wurst", password: "Husten" } as User).then((newUser) => {
    //     console.log(newUser);
    //     webapp.api(User).getAll().then((users) => {
    //         console.log(users);
    //     });
    // });

});
    