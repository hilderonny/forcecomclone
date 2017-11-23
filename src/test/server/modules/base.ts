import { TestHelper } from "../../utils/testhelper";
import { User } from "../../../common/types/user";
import { default as BaseModule } from "../../../server/modules/base"
import { hashSync, compareSync } from "bcryptjs"
import { expect } from "chai";
import { Token } from "../../../common/types/token";

describe('Module base', () => {
    
    beforeEach(async () => {
        await TestHelper.init()
        BaseModule(TestHelper.app)
    })

    describe('API login', () => {
        
        it('POST returns 403 when username was not found', async() => {
            let userToSend = { name: 'user', password: 'password' } as User
            await TestHelper.post('/api/login').send(userToSend).expect(403)
        })
        
        it('POST returns 403 when password is wrong for existing username', async() => {
            let userToSend = { name: 'user', password: 'password' } as User
            await TestHelper.post('/api/login').send(userToSend).expect(403)
        })
        
        it('POST returns 200 and token when login was successful', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'user', password: hashSync('password') } as User)
            let userToSend = { name: 'user', password: 'password' } as User
            let token = (await TestHelper.post('/api/login').send(userToSend).expect(200)).body as Token 
            expect(token.token).not.to.be.empty
        })
        
    })

    describe('API register', () => {
        
        it('POST returns 409 when given username is used by another user', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'user', password: hashSync('password') } as User)
            let userToSend = { name: 'user', password: 'password' } as User
            await TestHelper.post('/api/register').send(userToSend).expect(409)
        })
        
        it('POST encrypts the password', async() => {
            let password = 'password'
            let userToSend = { name: 'user', password: password } as User
            await TestHelper.post('/api/register').send(userToSend)
            let userFromDatabase = await TestHelper.app.db.findOne(User, { name: 'user' })
            expect(userFromDatabase).not.to.be.null
            if (userFromDatabase) {
                expect(userFromDatabase.password).not.to.be.undefined
                if (userFromDatabase.password) {
                    expect(userFromDatabase.password).not.to.equal(password)
                    expect(compareSync(password, userFromDatabase.password)).to.be.true
                }
            }
        })
        
        it('POST returns a login token when registration was successful', async() => {
            let password = 'password'
            let userToSend = { name: 'user', password: password } as User
            let token = (await TestHelper.post('/api/register').send(userToSend).expect(200)).body as Token 
            expect(token.token).not.to.be.empty
        })

        it('POST returns 400 when no password was set', async() => {
            let userToSend = { name: 'user' } as User
            await TestHelper.post('/api/register').send(userToSend).expect(400)
        })

        it('POST accepts empty passwords', async() => {
            let userToSend = { name: 'user', password: '' } as User
            await TestHelper.post('/api/register').send(userToSend).expect(200)
        })
        
    })

    describe('API User', () => {

        it('GET does not return the password of the user', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username', password: hashSync('password') } as User)
            let usersFromApi = (await TestHelper.get('/api/User')).body as User[]
            usersFromApi.forEach((user) => {
                expect(user.password).to.be.undefined
            })
        })

        it('GET/:id does not return the password of the user', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username', password: hashSync('password') } as User)
            let userFromApi = (await TestHelper.get('/api/User/' + existingUser._id)).body as User
            expect(userFromApi.password).to.be.undefined
        })

        it('POST creates an user when the name is not taken', async() => {
            let userToSend = { name: 'Unnamed1', password: 'password' } as User
            await TestHelper.post('/api/User').send(userToSend).expect(200)
        })

        it('POST returns 409 when an user with the given name already exists', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name1' } as User)
            let userToSend = { name: existingUser.name, password: 'password' } as User
            await TestHelper.post('/api/User').send(userToSend).expect(409)
        })

        it('POST encrypts the password', async() => {
            let password = 'password'
            let userToSend = { name: 'user', password: password } as User
            let createdUser = (await TestHelper.post('/api/User').send(userToSend).expect(200)).body as User
            let userFromDatabase = await TestHelper.app.db.findOne(User, createdUser._id)
            expect(userFromDatabase).not.to.be.null
            if (userFromDatabase) {
                expect(userFromDatabase.password).not.to.be.undefined
                if (userFromDatabase.password) {
                    expect(userFromDatabase.password).not.to.equal(password)
                    expect(compareSync(password, userFromDatabase.password)).to.be.true
                }
            }
        })

        it('POST returns 400 when no password was sent', async() => {
            let userToSend = { name: 'user' } as User
            await TestHelper.post('/api/User').send(userToSend).expect(400)
        })

        it('POST accepts empty passwords', async() => {
            let userToSend = { name: 'user', password: '' } as User
            await TestHelper.post('/api/User').send(userToSend).expect(200)
        })

        it('POST does not return the password of the user', async() => {
            let userToSend = { name: 'user', password: 'password' } as User
            let createdUser = (await TestHelper.post('/api/User').send(userToSend).expect(200)).body as User
            expect(createdUser.password).to.be.undefined
        })

        it('PUT updates an user', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username', password: hashSync('password') } as User)
            let userToSend = { name: 'changedusername' } as User
            await TestHelper.put('/api/User/' + existingUser._id).send(userToSend).expect(200)
        })

        it('PUT returns 409 when an user would get a new name which is already taken by another user', async() => {
            let firstUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name1' } as User)
            let secondUser = await TestHelper.app.db.insertOne<User>(User, { name: 'name2' } as User)
            let userToSend = { name: firstUser.name } as User
            await TestHelper.put('/api/User/' + secondUser._id).send(userToSend).expect(409)
        })

        it('PUT encrypts the password when it was sent', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username', password: hashSync('password') } as User)
            let password = 'changedpassword'
            let userToSend = { password: password } as User
            await TestHelper.put('/api/User/' + existingUser._id).send(userToSend)
            let userFromDatabase = await TestHelper.app.db.findOne(User, existingUser._id)
            expect(userFromDatabase).not.to.be.null
            if (userFromDatabase) {
                expect(userFromDatabase.password).not.to.be.undefined
                if (userFromDatabase.password) {
                    expect(userFromDatabase.password).not.to.equal(password)
                    expect(compareSync(password, userFromDatabase.password)).to.be.true
                }
            }
        })

        it('PUT accepts empty passwords', async() => {
            let existingUser = await TestHelper.app.db.insertOne<User>(User, { name: 'username', password: hashSync('password') } as User)
            let userToSend = { password: '' } as User
            await TestHelper.put('/api/User/' + existingUser._id).send(userToSend).expect(200)
        })

    })
    
})