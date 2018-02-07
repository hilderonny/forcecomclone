var assert = require("assert");
var th = require("../testhelper").TestHelper;

describe.only('API menu', () => {

    clientname = "0";

    it('Normal', async() => {
        await th.doLogin(`${clientname}_0_0`, "test");
        var menustructure = (await th.get('/api/menu').expect(200)).body;
        console.log(menustructure);
    });

    it('Portal', async() => {
        await th.doLogin(`portal_0_0`, "test");
        var menustructure = (await th.get('/api/menu').expect(200)).body;
        console.log(menustructure);
    });
    
});