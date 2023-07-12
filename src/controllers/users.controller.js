import usersManager from "../dao/UsersManager.js"
import { usersService } from '../services/service.js'
import { sendMail } from '../functions.js'

export const getAll = async(req, res) => {
    //const users = await usersService.get()
    const results = await usersManager.get()
    const usersList = results.map(user => { return ({
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            role: user.role,
            email: user.email,
            _id: user._id,
            cartId: user.cartId
        })
    })
    const users = { users: usersList }
    //res.json(results)
    res.render('users', users)
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
    res.redirect('/users')
}

export async function deleteById(req, res){
    const uid = req.params.uid
    const result = await usersManager.delete(uid)
    res.render('/users')
}

export async function deleteInactiveUsers(req, res){
    const users = await usersManager.get()
    users.map((user) => {
        if (user.last_connection - (Date.now() - 1*1*15*60 * 1000) < 0){
            usersManager.delete(user._id)

            //Send confirmation email
            let textMessage = {
                subject: `Usuario inactivo, ${user.first_name}`,
                text: 'Su usuario ha sido eliminado debido a su inacitivdad durante los últimos 30 días. Por favor regístrate nuevamente. ¡Gracias!'
            }
            sendMail(user, textMessage)
        }
    })
    res.render('/users', users)
}