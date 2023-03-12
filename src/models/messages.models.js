import mongoose from 'mongoose'

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    Id: Number,
    user: String,
    message: String
})

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel