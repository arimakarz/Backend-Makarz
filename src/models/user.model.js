import mongoose from "mongoose";

const collectionName = 'users'

//const userSchema = new mongoose.Schema({
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
    }
})

mongoose.set("strictQuery", false)
//const UserModel = mongoose.model(userCollection, userSchema)
//const UserModel = mongoose.model(collectionName, schema)

//export default UserModel
export default {
    collectionName,
    schema
}