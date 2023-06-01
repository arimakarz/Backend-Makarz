import UsersManager from "../dao/UsersManager.js"

export const getById = async(req, res) => {
    const {id} = req.params
    const user = await UsersManager.getById(id)
    return user
}

export const getByEmail = async(req, res) => {
    const {email} = req.params
    const user = await UsersManager.getByEmail(email)
    return user
}

export async function setRole(req, res){
    const uid = req.params.uid
    const user = await UsersManager.getById(uid)
    if (user.role == 'user') user.role = 'premium'
    else user.role = 'user'
    const result = await UsersManager.update(user.id, user)
    res.redirect('/api/products')
}