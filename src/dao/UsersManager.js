import mongoose from 'mongoose'
import userModel from '../models/user.model.js';

class UsersManager{
    constructor(){
        this.model = mongoose.model(userModel.collectionName, userModel.schema)
    }

    get = async () => {
        const users = await this.model.find()
        return users
    }

    getById = async (id) => {
        const user = await this.model.findOne({ _id: id })
        return user
    }

    getByEmail = async (email) => {
        const user = await this.model.findOne({ email: email})
        return user
    }

    update = async(id, data) => await this.model.updateOne({ _id: id }, data)
}

export default new UsersManager()