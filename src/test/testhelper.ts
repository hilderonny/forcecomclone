import { Db } from "../server/tools/db";


export class TestHelper {

    static async init() {
        await Db.init(true); // Drop all
    }

    static async prepareClients() {
        await Db.createClient('0');
        await Db.createClient('1');
    }

    static async prepareUserGroups() {
        await Db.createUserGroup('0_0', '0');
        await Db.createUserGroup('0_1', '0');
        await Db.createUserGroup('1_0', '1');
        await Db.createUserGroup('1_1', '1');
    }

    static async prepareUsers() {
        let hashedPassword = '$2a$10$mH67nsfTbmAFqhNo85Mz4.SuQ3kyZbiYslNdRDHhaSO8FbMuNH75S'; // Encrypted version of 'test'. Because bryptjs is very slow in tests.
        await Db.createUser('0_0_0', hashedPassword, '0_0', '0');
        await Db.createUser('0_0_ADMIN0', hashedPassword, '0_0', '0');
        await Db.createUser('0_1_0', hashedPassword, '0_1', '0');
        await Db.createUser('0_1_ADMIN0', hashedPassword, '0_1', '0');
        await Db.createUser('1_0_0', hashedPassword, '1_0', '1');
        await Db.createUser('1_0_ADMIN0', hashedPassword, '1_0', '1');
        await Db.createUser('1_1_0', hashedPassword, '1_1', '1');
        await Db.createUser('1_1_ADMIN0', hashedPassword, '1_1', '1');
    }

}