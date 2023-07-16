import mongoose from 'mongoose'
import Assert from 'assert'
import config from '../../src/config/config.js'
import { faker } from '@faker-js/faker'
import ProductManager from '../../src/dao/ProductManager.js'

faker.locale = 'es'

mongoose.connect(config.app.uri, config.app.dbName)

const assert = Assert.strict

xdescribe('Testing GET ProductManager', () => { 
    before(function() {
        this.productManager = new ProductManager()
    })

    beforeEach(function() {
        mongoose.connection.collections.users.drop()
    })

    it('GET: Debe devolver un array con todos los productos', async function() {
        const result = await this.productManager.getProducts()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('Se debe poder devolver un producto a partir de su id', async function() {
        const mockProduct = {
            _id: "648362c311ddb63849dc35b1"
        }
        const result = this.productManager.getProductById({ _id : mockProduct._id })
        assert.strictEqual(typeof user, 'object')
    })
 })

 xdescribe('POST de ProductManager', () => {
    before(function() {
        this.productManager = new this.productManager()
        this.mockProduct = {
            id: faker.database.mongodbObjectId().toString(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            stock: faker.random.numeric(1),
            code: faker.random.alphaNumeric(5)
        }
    })

    it('El ProductManager debe poder crear un producto', async function() {
        const result = await this.productManager.addProduct(this.mockProduct)
        assert.ok(result._id)
    })

    it('El ProductManager debe poder eliminar un producto a partir de su id', async function() {
        this.mockProduct = {
            _id: "648362c311ddb63849dc35b1"
        }
        const result = await this.productManager.deleteProduct(this.mockProduct)
        assert.ok(result._id)
    })

    it('El ProductManager debe poder actualizar un producto', async function() {
        const result = await this.productManager.updateProduct(this.mockProduct)
        assert.ok(result._id)
    })
 })