import mongoose from 'mongoose'
import Assert from 'assert'
import config from '../../src/config/config.js'
import { faker } from '@faker-js/faker'
import CartManager from '../../src/dao/CartManager.js'

faker.locale = 'es'

mongoose.connect(config.app.uri, config.app.dbName)

const assert = Assert.strict

xdescribe('Testing GET de CartManager', () => { 
    before(function() {
        this.CartManager = new CartManager()
    })

    beforeEach(function() {
        mongoose.connection.collections.users.drop()
    })

    it('Se debe poder obtener un carrito a partir de su id', async function() {
        const cart = {
            _id: "649ba09db258019bb78e0382"
        }
        const result = this.productManager.getCart({ _id : cart._id })
        assert.strictEqual(typeof user, 'object')
    })
 })

 xdescribe('POST de Cart', () => {
    before(function() {
        this.productManager = new this.productManager()
        this.cartId = "649ba09db258019bb78e0382"
        this.productId = "648362c311ddb63849dc35b1"
    })

    it('Se debe poder agregar un producto al carrito', async function() {
        const result = await this.CartManager.addToCart(this.cartId, this.productId)
        assert.ok(result._id)
    })

    it('El CartManager debe poder eliminar un producto del carrito a partir del id del producto', async function() {
        const result = await this.productManager.deleteFromCart(this.cartId, this.productId)
        assert.ok(result._id)
    })

    it('El CartManager debe poder eliminar todos los productos del carrito', async function() {
        const result = await this.CartManager.deleteAll(this.cartId)
        assert.ok(result._id)
    })
 })