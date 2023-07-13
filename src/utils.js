import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-github2'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from './config/credentials.js'
import EError from './services/errors/enums.js';
import CustomError from "./services/errors/custom_error.js";

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = (user, expiringTime) => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: expiringTime })
    return token
}

export const authToken = (req, res, next) => {
    let token = req.headers.auth
    if (!token) token = req.cookies[JWT_COOKIE_NAME]
    if (!token){
        const error = CustomError.createError({
            name: 'Unauthenticated',
            cause: "User credentials error",
            message: 'User not authenticated. Please login',
            code: EError.UNAUTHORIZATION_ERROR,
            backRoute: '/sessions/login'
        })
        error.statusCode = 401
        res.render('errors/base', { error })
    }   
    jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
        if (error){
            const error = CustomError.createError({
                name: 'Unauthorized',
                cause: "User premissions error",
                message: 'User not authorizated.',
                code: EError.UNAUTHORIZATION_ERROR,
                backRoute: '/sessions/login'
            })
            error.statusCode = 403
            res.render('errors/base', { error })
        } 
        else req.user = credentials.user
        next()
    })
}

export const authTokenAdmin = (req, res, next) => {
    let token = req.headers.auth
    if (!token) token = req.cookies[JWT_COOKIE_NAME]
    jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
        if ((error) || (credentials.user.role != 'admin')){
            const error = CustomError.createError({
                name: 'Unauthorized',
                cause: "User premissions error",
                message: 'User not authorizated.',
                code: EError.UNAUTHORIZATION_ERROR,
                backRoute: '/api/products'
            })
            error.statusCode = 401
            res.render('errors/base', { error })
        }
        else req.user = credentials.user
        next()
    })
}

export const extractCookie = req => {
    const token = ( req && req.cookies ) ? req.cookies[JWT_COOKIE_NAME] : null
    return token
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(error, user, info){
            if (error) return next(error)
            if (!user) {
                //CREAR ERROR DE USUARIO Y NEXT(ERROR)
                return res.status(401).render('errors/base', {error: info.message ? info.message : info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}