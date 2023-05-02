import { JWT_COOKIE_NAME } from '../config/credentials.js'
import config from '../config/config.js'
import cartsManager from "../dao/CartsManager.js"

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
    res.render('errors/base',{ error: 'Missing information. Fail login'})
}

export async function registerForm(req, res){
    res.render('sessions/register')
}

export async function registerUser(req, res){
    res.redirect('/sessions/login')
}

export async function registerFail(req, res){
    res.render('errors/base', { error: 'Oops something wrong happened. Fail register' })
}

export async function logout(req, res){
    res.clearCookie(JWT_COOKIE_NAME).redirect('login')
}