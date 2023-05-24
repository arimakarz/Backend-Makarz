import passport from "passport";
import local from 'passport-local'
import passport_jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import UserModel from "../models/user.model.js";
import cartsManager from "../dao/CartsManager.js";
import { createHash, isValidPassword, generateToken, authToken, extractCookie } from "../utils.js";
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
            const user = await UserModel.findOne({ email: username })
            
            if (user){
                console.log('User is already registered')
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

            
            const result = await UserModel.create(newUser)
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
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                logger.warn('Wrong credentials. User not found on Database')
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            
            //req.session.user = user

            //Creating token
            const token = generateToken(user)
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
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }else{
                const resultCart = await cartsManager.createCart()
                const newCart = await cartsManager.getNewCart()
                const newUser = await UserModel.create({
                    first_name: profile._json.name,
                    last_name: '',
                    //email: profile._json.email,
                    email: "arimakarz@gmail.com",
                    role: 'user',
                    cartId: newCart._id
                })
                return done(null, newUser)
            }
        }catch(error){
            return done(`Error to login with github. Error: ${error}`)
        }
    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        }catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport