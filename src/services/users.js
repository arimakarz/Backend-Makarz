import mongoose from 'mongoose'
import userModel from '../models/user.model.js'
import Repository from './Repository.js'

export default class UserService extends Repository {
    constructor(dao) {
        const user = mongoose.model(userModel.collectionName, userModel.schema)
        super(dao, user)
    }
}