import passport from "passport";
import local from 'passport-local'
import passport_jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import UserModel from "../models/user.model.js";
import usersManager from "../dao/UsersManager.js";
import cartsManager from "../dao/CartsManager.js";
import { createHash, isValidPassword, generateToken, extractCookie } from "../utils.js";
import { sendMail, sendSMS } from '../functions.js'
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from './credentials.js'
import CustomError from "../services/errors/custom_error.js";
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info.js';
import logger from "../logger.js";

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        //try{
            //const user = await UserModel.findOne({ email: username })
            const user = await usersManager.getByEmail(username)
            
            if (user){
                logger.error('User is already registered')
                const error = CustomError.createError({
                    name: 'User creation error',
                    cause: generateErrorInfo(user),
                    message: 'Email already registered',
                    code: EError.EMAIL_REGISTERED_ERROR
                })
                error.statusCode = 403
                error.registerButton = true
                return done(error, false)
            }

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: createHash(password),
                role: 'user'
            }
            
            if ((!first_name) || (!last_name) || (!email) || (!age) || (!parseInt(age) > 0) || (!password)){
                const error = CustomError.createError({
                    name: 'User creation error',
                    cause: generateErrorInfo(newUser),
                    message: 'Error trying to create a user',
                    code: EError.INVALID_TYPES_ERROR
                })
                error.statusCode = 400
                error.registerButton = true
                return done(error, false)
            }

            
            const result = await usersManager.save(newUser)
            //Send confirmation email
            let textMessage = {
                subject: `¡Bienvenido, ${newUser.first_name}`,
                text: 'Se ha registrado un usuario nuevo. ¡Ahora podes hacer tus compras con nosotros!'
            }
            sendMail(newUser, textMessage)
            sendSMS(111)

            return done(null, result)

        // }catch (err) {
        //     return done('Error getting user', false)
        // }
        
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try{
            //const user = await UserModel.findOne({ email: username })
            const user = await usersManager.getByEmail( username )
            if (!user) {
                logger.warn('Wrong credentials. User not found on Database')
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            
            //Creating token
            const token = generateToken(user, '24h')
            user.token = token
            
            return done(null, user)
        }catch (err) {
            return ({ status: 'error', error: err})
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.8a9a5b0ffa2ce20c',
        clientSecret: '974805ab461e2ff707514cc698e276cb0bc18707',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const resultCart = await cartsManager.createCart()
            const newCart = await cartsManager.getNewCart()

            const user = await usersManager.getByEmail(profile._json.email)
            if (user) {
                return done(null, user)
            }else{
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.last_name,
                    email: profile._json.email,
                    role: 'user',
                    cartId: newCart._id
                }
                const result = await usersManager.save(newUser)
                const user = await usersManager.getByEmail(newUser.email)
                
                return done(null, user)
            }
        }catch(error){
            error = CustomError.createError({
                name: 'User creation error',
                cause: generateErrorInfo(newUser),
                message: 'Error trying to create a user',
                code: EError.INVALID_TYPES_ERROR
            })
            error.statusCode = 400
            error.registerButton = true
            return done(error, false)
        }
    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        }catch (error) {
            error = CustomError.createError({
                name: 'User not authorized',
                cause: generateErrorInfo(newUser),
                message: 'Unauthorized user',
                code: EError.INVALID_TYPES_ERROR
            })
            error.statusCode = 403
            error.registerButton = true
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersManager.getById(id)
        done(null, user)
    })

}

export default initializePassport