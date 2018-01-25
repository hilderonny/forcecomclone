import { App } from "../app";
import { Auth, LoggedInUserRequest } from "../utils/auth";
import { MenuItem } from "../../common/types/menuitem";


export default () => {

    App.router.get('/menu', Auth.authenticate(null, false), async (req: LoggedInUserRequest, res) => {
        res.send([
            { label: 'Datentypen', listapi: '/api/datatypes' },
            { label: 'LABEL2' }
        ] as MenuItem[]);
    });
    
}