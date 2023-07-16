import mongoose from 'mongoose'
import Product from '../models/products.model.js'
import Cart from '../models/carts.models.js'
import User from '../models/user.model.js'
import logger from '../logger.js'

export default class MongoDAO {
    constructor(uri, dbName){
        this.mongoose = mongoose.connect(uri, {dbName})
        this.models = {
            [Product.model]: mongoose.model(Product.collectionName, Product.schema),
            [Cart.model]: mongoose.model(Cart.collectionName, Cart.schema),
            [User.model]: mongoose.model(User.collectionName, User.schema)
        }
    }

    get = async(options, entity) => {
        if (!this.models[entity]) return {error: 'Entity not found in models'}
        let results = await this.models[entity].find(options)
        return results.map(result => result.toObject())
    }

    getById = async(options, entity) => {
        if (!this.models[entity]) return {error: 'Entity not found in models'}
        let results = await this.models[entity].findOne(options)
        return results
    }

    save = async(options, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let instance = new this.models[entity](document)
            let result = await instance.save()
            return result ? result.toObject() : null
        } catch(error) {
            logger.error('Error', 'Cannot insert document')
            return null
        }
    }

    update = async(options, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let instance = new this.models[entity](document)
            let result = await instance.updateOne(options)
            return result ? result.toObject() : null
        } catch(error) {
            logger.error('Error', 'Cannot update document')
            return null
        }
    }

    delete = async(options, entity) => {
        if (!this.models[entity]) return {error: 'Entity not found in models'}
        let results = await this.models[entity].deleteOne(options)
        return results
    }
}