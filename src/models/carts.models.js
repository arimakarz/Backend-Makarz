import mongoose from 'mongoose'

//const cartCollection = 'carts';
const collectionName = 'carts';

//const cartSchema = new mongoose.Schema({
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

//cartSchema.pre('find', function(){
schema.pre('find', function(){
    this.populate('products.product')
})

//const cartModel = mongoose.model(cartCollection, cartSchema)

//export default cartModel
export default {
    collectionName,
    schema
}