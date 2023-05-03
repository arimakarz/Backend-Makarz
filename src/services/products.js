import mongoose from 'mongoose'
import productModel from '../models/products.model.js'
import Repository from './Repository.js'

export default class ProductService extends Repository {
    constructor(dao) {
        const product = mongoose.model(productModel.collectionName, productModel.schema)
        super(dao, product)
    }
}