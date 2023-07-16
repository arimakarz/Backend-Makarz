import mongoose from "mongoose";

const collectionName = 'users'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    last_connection: {
        type: Date, 
        default: Date.now
    }
})

mongoose.set("strictQuery", false)
//const UserModel = mongoose.model(collectionName, schema)

//export default UserModel
export default {
    collectionName,
    schema
}