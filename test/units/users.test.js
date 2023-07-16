import mongoose from 'mongoose'
import User from '../../src/dao/UsersManager.js'
import Assert from 'assert'
import config from '../../src/config/config.js'
import { faker } from '@faker-js/faker'

faker.locale = 'es'

mongoose.connect(config.app.uri, config.app.dbName)

const assert = Assert.strict

xdescribe('Testing GET User Dao', () => { 
    before(function() {
        this.usersDao = new User()
    })

    beforeEach(function() {
        mongoose.connection.collections.users.drop()
    })

    it('El GET debe devolver un array con los usuarios', async function() {
        const result = await this.usersDao.get()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('El UserManager debe poder devolver un usuario a partir del email', async function() {
        const mockUser = {
            email: "arielamakarz@gmail.com",
        }
        const user = this.usersDao.getByEmail({ email : mockUser.email })
        assert.strictEqual(typeof user, 'object')
    })

    it('El UserManager debe poder devolver un usuario a partir del id', async function() {
        const mockUser = {
            _id: "64a62187920f2bdcb95bae83"
        }
        const user = this.usersDao.getByEmail({ email : mockUser._id })
        assert.strictEqual(typeof user, 'object')
    })
 })

 xdescribe('Testing POST de UserManager', () => {
    before(function() {
        this.usersDao = new User()
        this.mockUser = {
            first_name: faker.name.firstName,
            last_name: faker.name.lastName,
            email: faker.name.email,
            password: "coder"
        }
    })

    it('El UserManager debe poder crear usuarios', async function() {
        const result = await this.usersDao.save(this.mockUser)
        assert.ok(result._id)
    })
 })