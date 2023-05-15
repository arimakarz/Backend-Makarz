import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-github2'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from './config/credentials.js'

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export const authToken = (req, res, next) => {
    let token = req.headers.auth
    if (!token) token = res.cookies[JWT_COOKIE_NAME]
    if (!token) res.status(401).send({ error: 'Not auth' })
    jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
        if (error) res.status(403).send({ error: 'Not authorized' })
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