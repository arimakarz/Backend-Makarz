import { faker } from '@faker-js/faker'

faker.locale = 'es'

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId().toString(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        stock: faker.random.numeric(1), //1 es la cantidad de digitos
        thumbnails: faker.image.image(),
        code: faker.random.alphaNumeric(5)
    }
}