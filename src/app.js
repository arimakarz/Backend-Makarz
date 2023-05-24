import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import chatRouter from './router/chat.router.js';
import sessionRouter from './router/session.router.js';
import productManager from'./dao/ProductManager.js';
import MessageManager from './dao/MessagesManager.js'
import initializePassport from './config/passport.config.js';
import __dirname, { passportCall } from './utils.js';
import config from './config/config.js'
import { generateProduct } from './mocking.js';
import errorHandler from './middlewares/error.js'
import CustomError from './services/errors/custom_error.js';
import EError from './services/errors/enums.js';
import logger from './logger.js'

const app = express();
const httpServer = app.listen(3000, () => { console.log('Server connected!')})
const io = new Server(httpServer);
//const productManager = new ProductManager(__dirname + '/../products.json');

app.engine('handlebars', handlebars.engine()) 
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/../public'))
app.use('/chat', express.static(__dirname + '/../public'))
app.use(cookieParser(config.app.cookie_sign))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const PORT = config.app.port

//DB Connection
const uri = config.app.uri
const dbName = config.app.dbName
mongoose.set('strictQuery', false)

app.use(session({
    //------No grabo la sesión en la BD
    // store: MongoStore.create({
    //     mongoUrl: uri,
    //     dbName: dbName,
    //     mongoOptions: {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     },
    //     ttl: 100
    // }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/products', passportCall('current'), productsRouter);
app.use('/sessions/current', passportCall('current'), sessionRouter);
app.use('/api/carts', cartsRouter);
app.use('/sessions', sessionRouter);
app.use('/', chatRouter);

app.get('/mockingproducts', (req, res) => {
    const docs = []
    for (let index = 0; index < 100; index++){
        docs.push(generateProduct())
    }
    const results = {
        docs: docs
    }
    res.render('mocking', results)
})

app.get('/loggerTest', (req, res) => {
    res.render('loggerTest')
})

app.get('/loggerTest/:type', (req, res) => {
    const { type } = req.params
    switch (type) {
        case "debug":
            logger.debug('Debug logger test')
            break;
        case "http":
            logger.http('HTTP logger test')
            break;
        case "info":
            logger.info('Info logger test')
            break;
        case "warning":
            logger.warn('Warning logger test')
            break;
        case "error":
            logger.error('Error logger test')
            break;
        case "fatal":
            logger.error('Fatal logger test')
            break;
        default:
            logger.error('Fatal logger test')
            break;
    }
    res.render('loggerTest')
})

app.all('*', (req, res, next) => {
    const error = CustomError.createError({
        name: 'Route error',
        cause: 'Inexistent route',
        message: `Can't find ${req.originalUrl} on the server`,
        code: EError.ROUTING_ERROR,
        backRoute: '/sessions/login'
    })
    error.statusCode = 404
    if (req.session.user) error.backTo = '/api/products'
    logger.error(`Inexistent route. ${error.message}`)
    next(error)
})

app.use(errorHandler)

mongoose.connect(uri, {
    dbName: dbName
}, error => {
    if (error){
        logger.error('error', 'No se pudo conectar con la base de datos')
        return
    }
    logger.log('info', 'Database connected')

    const server = app.listen(PORT, () => logger.log('info', `Listening on port ${PORT}`))
    
    server.on('error', e => logger.error('error', e)) 
})

let messages = []

io.on('connection', socket => {
    console.log('New client connected!')
    socket.on("newProduct", data =>{
        console.log(data)
        //const productsList = productManager.getProducts();
        //io.emit('realTimeProducts', productsList)
    })

    socket.on('deleteProduct', id => {
        const result = productManager.deleteProduct(id);
        const productList = productManager.getProducts();
        io.emit('realTimeProducts', {
            productList,
            result
        })
    })

    socket.on('deleteProductById', id => {
        const result = productManager.deleteProduct(id);
        const productList = productManager.getProducts();
        io.emit('realTimeProducts', {
            productList,
            result
        })
    })

    socket.on("message", async data =>{
        messages.push(data)
        io.emit('logs', messages)
        console.log(data)
        const messageManager = new MessageManager(data.user)
        await messageManager.addMessage(data.user, data.message)
    })
})

