import dotenv from 'dotenv'

dotenv.config()

export default {
    app:{
        persistence: process.env.PERSISTENCE,
        uri: process.env.MONGO_URL,
        dbName: process.env.DB_NAME,
        cookie_sign: process.env.COOKIE_SIGN,
        mail_sender: process.env.MAIL_SENDER
    },
    admin:{
        mail: process.env.ADMIN_NAME,
        pass: process.env.ADMIN_PASS,
        role: 'admin'
    }
}