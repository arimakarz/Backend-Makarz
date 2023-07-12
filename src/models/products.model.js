import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

//export default class Product{
//     static get model(){
//         return 'products'
//     }

//     static get schema(){
//         const mySchema = new mongoose.Schema({
//             title: String,
//             description: String,
//             price: Number,
//             category: String,
//             status: {
//                 type: Boolean,
//                 default: true
//             },
//             thumbnails: {
//                 type: Array,
//                 default: []
//             },
//             code: String,
//             stock: Number,
//             owner: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "users",
//                 default: "6425d5d0a88fef02915280d7"
//             }
//         })
//         mySchema.plugin(mongoosePaginate)
//         return mySchema
//     }
// }
//const productCollection = 'products';
const collectionName = 'products'
//const productSchema = new mongoose.Schema({
const schema = new mongoose.Schema({
    //id: String,
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
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: "6425d5d0a88fef02915280d7"
    }
})

//productSchema.plugin(mongoosePaginate)
schema.plugin(mongoosePaginate)

//const productModel = mongoose.model(productCollection, productSchema)

//export default productModel
export default {
    collectionName,
    schema
}