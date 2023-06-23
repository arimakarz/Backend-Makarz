import mongoose from 'mongoose'
import cartModel from '../models/carts.models.js'
import Repository from './Repository.js'

export default class CartService extends Repository {
    constructor(dao) {
        const cart = mongoose.model(cartModel.collectionName, cartModel.schema)
        super(dao, cart)
    }
}