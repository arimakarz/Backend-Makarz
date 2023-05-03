import mognoose, { Schema } from 'mongoose'

const collectionName = 'tickets'

const schema = new mognoose.Schema({
    code: String,
    amount: Number,
    purchaser: String
})

export default {
    collectionName,
    schema
}