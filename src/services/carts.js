import mongoose from 'mongoose'
import cartModel from '../models/products.model.js'
import Repository from './Repository.js'

export default class ProductService extends Repository {
    constructor(dao) {
        const cart = mongoose.model(cartModel.collectionName, cartModel.schema)
        super(dao, cart)
    }
}