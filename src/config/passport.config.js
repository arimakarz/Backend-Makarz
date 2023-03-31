import passport from "passport";
import local from 'passport-local'
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'
import CartsManager from "../dao/CartsManager.js";

const LocalStrategy = local.Strategy
const cartsManager = new CartsManager()
const initializePassport = () => {
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try{
            const user = await UserModel.findOne({ email: username })
            if (user){
                console.log('User is already registered')
                return done(null, false)
            }

            const resultCart = await cartsManager.createCart()
            const newCart = await cartsManager.getNewCart()

            console.log(newCart)

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: createHash(password),
                role: 'user',
                cartId: newCart._id
            }
            const result = await UserModel.create(newUser)
            
            return done(null, result)

        }catch (err) {
            return done('Error getting user', false)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try{
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User doesnt exist')
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
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
        console.log(profile)

        try{
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }else{
                const newUser = await UserModel.create({
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email
                })
                return done(null, newUser)
            }
        }catch(error){
            return done('Error to login with github')
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