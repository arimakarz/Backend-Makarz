import mongoose from 'mongoose'

const collectionName = 'carts';

const schema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})

schema.pre('find', function(){
    this.populate('products.product')
})

export default {
    collectionName,
    schema
}