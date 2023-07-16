import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Products', () => {
    it('The endpoint POST /api/products must create a new product', async () => {
        const mockProduct = {
            id: faker.database.mongodbObjectId().toString(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            stock: faker.random.numeric(1),
            code: faker.random.alphaNumeric(5)
        }
        const response = await requester.post('/api/products').send(mockProduct)
        const { status, ok, _body } = response
        expect (_body).to.have.property('_id')
    })
})