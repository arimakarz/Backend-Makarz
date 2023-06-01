import { JWT_COOKIE_NAME } from '../config/credentials.js'
import config from '../config/config.js'
import cartsManager from "../dao/CartsManager.js"
import usersManager from '../dao/UsersManager.js'
import CustomError from "../services/errors/custom_error.js";
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info.js';
import logger from '../logger.js'
import { sendMail } from '../functions.js'
import { generateToken, createHash } from '../utils.js'
import UsersManager from '../dao/UsersManager.js';

export async function loginForm (req, res){
    res.render('sessions/login')
}

export async function login(req, res){
    if (!req.user){
        return { error: "Wrong email or password" }
    }
    let role = req.user.role
    await cartsManager.createCart()
    if (req.user.email == config.admin.mail) role = config.admin.role

    req.session.user = {
        email: req.user.email,
        role
    }
    res.cookie(JWT_COOKIE_NAME, req.user.token)
    res.redirect('/api/products')
}

export async function loginFail(req, res){
    const error = CustomError.createError({
        name: 'User creation error',
        cause: 'Wrong credentials',
        message: 'Username or password is incorrect',
        code: EError.UNAUTHORIZATION_ERROR,
        backTo: '/sesions/login'
    })
    error.statusCode = 400
    error.registerButton = true
    res.render('errors/base', { error })
}

export async function registerForm(req, res){
    res.render('sessions/register')
}

export async function registerUser(req, res){
    res.redirect('/sessions/login')
}

export async function registerFail(req, res){
    const user = {
        first_name: "",
        last_name: "",
        age: 1
    }
    const error = CustomError.createError({
        name: 'User creation error',
        cause: generateErrorInfo(user),
        message: 'Error trying to create a user',
        code: EError.INVALID_TYPES_ERROR
    })
    error.statusCode = 400
    error.registerButton = true
    logger.warn('Cannot register user. Missing types')
    res.render('errors/base', { error })
}

export async function logout(req, res){
    res.clearCookie(JWT_COOKIE_NAME).redirect('login')
}

export async function resetPasswordSendMailForm(req, res){
    res.render('sessions/resetPass')
}

export async function resetPasswordSendMail(req, res){
    const { email } = req.body
    const user = await usersManager.getByEmail(email)
    
    if (!user) res.render('/errors/base', { message: "User not found. Please register."})
    const token = generateToken(user, '1h')
    user.token = token

    const link = `http://localhost:8080/sessions/reset/${user._id}/${user.token}`;
        
    let textMessage = {
        subject: `Reseteo de password`,
        html: `<h3>Reset password</h3><p><a href="${link}">Haz click aquí para resetear tu contraseña</a></p>`
    }
    sendMail(user, textMessage)
    res.render('sessions/resetPass', {status: 'sent'})
}

export function resetForm(req, res) {
    const user = req.params
    res.render('sessions/reset', { userID: user.userID, token: user.token})
}

export async function resetPassword(req, res) {
    const user = req.params
    const { password, checkPassword } = req.body
    const userDB = await usersManager.getById(user.userID)
    if (password !== checkPassword) return res.send('Password not match')
    if ( password == userDB.password) return res.send('New password must me different than the last one')
    userDB.password = createHash(password)
    await usersManager.update(userDB.id, userDB)
    res.redirect('/sessions/login')
}