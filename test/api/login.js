var assert = require("assert");
var th = require("../testhelper").TestHelper;

describe('API login', () => {

    it('responds to GET with 404', async() => {
        await th.get('/api/login').expect(404);
    });

    it('responds to PUT with 404', async() => {
        await th.put('/api/login', {}).expect(404);
    });

    it('responds to DELETE with 404', async() => {
        await th.delete('/api/login').expect(404);
    });

    it('responds to POST without arguments with 401', async() => {
        await th.post('/api/login', {}).expect(401);
    });

    it('responds to POST with wrong username with 401', async() => {
        await th.post('/api/login', { username : 'wrong', password : 'test' }).expect(401);
    });

    it('responds to POST with wrong password with 401', async() => {
        await th.post('/api/login', { username : '0_0_0', password : 'wrong' }).expect(401);
    });
    
    it('responds to POST with 0_0_0/test with 200 and token', async() => { // The testhelper creates an 0_0_0/test user
        var result = await th.post('/api/login', { username : '0_0_0', password : 'test' }).expect(200);
        assert.ok(result.body.token, 'no token in response');
    });
    
});