import { JWT_COOKIE_NAME } from '../config/credentials.js'
import config from '../config/config.js'
import cartsManager from "../dao/CartsManager.js"
import CustomError from "../services/errors/custom_error.js";
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info.js';
import logger from '../logger.js'

export async function loginForm (req, res){
    res.render('sessions/login')
}

export async function login(req, res){
    if (!req.user){
        return { error: "Wrong email or password" }
    }
    let role = 'user'
    await cartsManager.createCart()
    if (req.user.email == config.admin.mail){
        role = config.admin.role
    }
    req.session.user = {
        email: req.user.email,
        role
    }
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/api/products')
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