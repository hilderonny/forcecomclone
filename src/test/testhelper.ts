import { Db } from "../server/tools/db";
import * as supertest from "supertest";
import { Server } from "net";
import { App } from "../server/tools/app";
import { Test } from "supertest";
import { TokenResponse } from "../common/types";

export class TestHelper {

    static app: Server;

    static delete(url: string): Test {
        return supertest(TestHelper.app).delete(url);
    }

    static async doLoginAndGetToken(username: string, password: string): Promise<string> {
        let tokenResponse = (await TestHelper.post("/api/login", { 'username' : username, 'password' : password }).expect(200)).body as TokenResponse;
        return tokenResponse.token;
    }

    static get(url: string): Test {
        return supertest(TestHelper.app).get(url);
    }

    static async init() {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignore self signed certificates
        await Db.init(true); // Drop all
        await TestHelper.prepareClients();
        await TestHelper.prepareUserGroups();
        await TestHelper.prepareUsers();
        TestHelper.app = (await App.start())!;
    }

    static post(url: string, data: object): Test {
        return supertest(TestHelper.app).post(url).send(data);
    }

    private static async prepareClients() {
        await Db.createClient('0');
        await Db.createClient('1');
    }

    private static async prepareUserGroups() {
        await Db.createUserGroup('portal_0', 'portal');
        await Db.createUserGroup('portal_1', 'portal');
        await Db.createUserGroup('0_0', '0');
        await Db.createUserGroup('0_1', '0');
        await Db.createUserGroup('1_0', '1');
        await Db.createUserGroup('1_1', '1');
    }

    private static async prepareUsers() {
        let hashedPassword = '$2a$10$mH67nsfTbmAFqhNo85Mz4.SuQ3kyZbiYslNdRDHhaSO8FbMuNH75S'; // Encrypted version of 'test'. Because bryptjs is very slow in tests.
        await Db.createUser('portal_0_0', hashedPassword, 'portal_0', 'portal');
        await Db.createUser('portal_0_ADMIN0', hashedPassword, 'portal_0', 'portal');
        await Db.createUser('portal_1_0', hashedPassword, 'portal_1', 'portal');
        await Db.createUser('portal_1_ADMIN0', hashedPassword, 'portal_1', 'portal');
        await Db.createUser('0_0_0', hashedPassword, '0_0', '0');
        await Db.createUser('0_0_ADMIN0', hashedPassword, '0_0', '0');
        await Db.createUser('0_1_0', hashedPassword, '0_1', '0');
        await Db.createUser('0_1_ADMIN0', hashedPassword, '0_1', '0');
        await Db.createUser('1_0_0', hashedPassword, '1_0', '1');
        await Db.createUser('1_0_ADMIN0', hashedPassword, '1_0', '1');
        await Db.createUser('1_1_0', hashedPassword, '1_1', '1');
        await Db.createUser('1_1_ADMIN0', hashedPassword, '1_1', '1');
    }

    static put(url: string, data: object): Test {
        return supertest(TestHelper.app).put(url).send(data);
    }

}

before(async() => {
    await TestHelper.init(); // Inititlize database once before all tests
});

after(async() => {
    await App.stop();
});
