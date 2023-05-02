import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

//const productCollection = 'products';
const collectionName = 'products'

//const productSchema = new mongoose.Schema({
const schema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    status: {
        type: Boolean,
        default: true
    },
    thumbnails: {
        type: Array,
        default: []
    },
    code: String,
    stock: Number
})

//productSchema.plugin(mongoosePaginate)
schema.plugin(mongoosePaginate)

//const productModel = mongoose.model(productCollection, productSchema)

//export default productModel
export default {
    collectionName,
    schema
}