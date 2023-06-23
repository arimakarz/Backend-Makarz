import usersManager from "../dao/UsersManager.js"
import { usersService } from '../services/service.js'

export const getAll = async(req, res) => {
    const users = await usersManager.get()
    //const users = await usersService.get()
    console.log(users)
    const result = { users }
    res.render('users', result)
}

export const getById = async(req, res) => {
    const {id} = req.params
    const user = await usersManager.getById(id)
    return user
}

export const getByEmail = async(req, res) => {
    const {email} = req.params
    const user = await usersManager.getByEmail(email)
    return user
}

export async function setRole(req, res){
    const uid = req.params.uid
    const user = await usersManager.getById(uid)
    if (user.role == 'user') user.role = 'premium'
    else user.role = 'user'
    const result = await usersManager.update(user.id, user)
    res.redirect('/api/products')
}