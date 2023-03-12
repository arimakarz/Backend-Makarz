import mongoose from 'mongoose'

const productCollection = 'products';

const productSchema = new mongoose.Schema({
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

const productModel = mongoose.model(productCollection, productSchema)

export default productModel