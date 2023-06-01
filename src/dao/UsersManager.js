import mongoose from 'mongoose'
import userModel from '../models/user.model.js';

class UsersManager{
    constructor(){
        //this.model = mongoose.model(userModel.collectionName, userModel.schema)
    }

    getById = async () => {
        const users = await userModel.find()
        return users
    }

    getById = async (id) => {
        const user = await userModel.findOne({ _id: id})
        return user
    }

    getByEmail = async (email) => {
        const user = await userModel.findOne({ email: email})
        return user
    }

    update = async(id, data) => await userModel.updateOne({ _id: id }, data)
}

export default new UsersManager()