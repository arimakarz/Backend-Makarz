import mongoose from 'mongoose'
import Product from '../models/products.model.js'
import Cart from '../models/carts.models.js'

export default class MongoDAO {
    constructor(uri, dbName){
        this.mongoose = mongoose.connect(uri, {dbName})
        this.models = {
            [Product]: mongoose.model(Product.collectionName, Product.schema),
            [Cart]: mongoose.model(Cart.collectionName, Cart.schema)
        }
    }

    get = async(options, entity) => {
        if (!this.models[entity]) return {error: 'Entity not found in models'}
        let results = await this.models[entity].find(options)
        return results.map(result => result.toObject())
    }

    getById = async(options, entity) => {
        console.log(this.models)
        console.log(entity)
        if (!this.models[entity]) return {error: 'Entity not found in models'}
        let results = await this.models[entity].findOne(options)
        //console.log(results)
        return results
    }
}