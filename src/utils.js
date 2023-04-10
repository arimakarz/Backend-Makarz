import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-github2'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME} from './config/credentials.js'

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

export const extractCookie = req => {
    return ( req && req.cookies ) ? req.cookies[JWT_COOKIE_NAME] : null
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(error, user, info){
            if (error) return next(error)
            if (!user) return res.status(401).render('errors/base', {error: info.message ? info.message : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}