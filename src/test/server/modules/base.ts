import { TestHelper } from "../../utils/testhelper";
import { User } from "../../../common/types/user";
import { default as BaseModule } from "../../../server/modules/base"


describe('Module base', () => {
    
    beforeEach(async () => {
        await TestHelper.init()
        BaseModule(TestHelper.app)
    })

    describe('API User', () => {

        it('POST creates an user when the name is not taken', async() => {
            let userToSend = { name: 'Unnamed1' } as User
            await TestHelper.post('/api/User').send(userToSend).expect(200)
        })

        it('POST returns an error when an user with the given name already exists', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name1' } as User)
            let userToSend = { name: existingUser.name } as User
            await TestHelper.post('/api/User').send(userToSend).expect(409)
        })

        it('PUT updates an user', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username' } as User)
            let userToSend = { name: 'changedusername' } as User
            await TestHelper.put('/api/User/' + existingUser._id).send(userToSend).expect(200)
        })

        it('PUT returns an error when an user would get a new name which is already taken by another user', async() => {
            let firstUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name1' } as User)
            let secondUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name2' } as User)
            let userToSend = { name: firstUser.name } as User
            await TestHelper.put('/api/User/' + secondUser._id).send(userToSend).expect(409)
        })

    })
    
})