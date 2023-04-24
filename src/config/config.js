import dotenv from 'dotenv'

dotenv.config()

export default {
    app:{
        uri: process.env.MONGO_URL,
        dbName: process.env.DB_NAME
    },
    admin:{
        mail: process.env.ADMIN_NAME,
        pass: process.env.ADMIN_PASS,
        role: 'admin'
    }
}