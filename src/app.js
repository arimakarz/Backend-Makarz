import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import chatRouter from './router/chat.router.js';
import sessionRouter from './router/session.router.js';
import ProductManager from'./dao/ProductManager.js';
import MessageManager from './dao/MessagesManager.js'
import __dirname from './utils.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const httpServer = app.listen(3000, () => { console.log('Server connected!')})
const io = new Server(httpServer);
const productManager = new ProductManager(__dirname + '/../products.json');

app.engine('handlebars', handlebars.engine()) 
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/../public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}))


//DB Connection
const uri = 'mongodb+srv://coder:coder@cluster0.wxncseh.mongodb.net/';
const dbName = 'ecommerce'

//mongoose.set('strictQuery', false)

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/sessions', sessionRouter);
app.use('/', chatRouter);

mongoose.connect(uri, {
    dbName: dbName
}, error => {
    if (error){
        console.log('No se pudo conectar con la base de datos')
        return
    }
    console.log('Database connected')

    const server = app.listen(8080, () => console.log('Server up!'))
    server.on('error', e => console.log(e)) 
})

let messages = []

// await productModel.create({
//     id: 1,
//     title: "Producto 1",
//     description: "Este es el primer producto",
//     price: 100,
//     category: "Electronic",
//     status: "true",
//     thumbnails: [],
//     code: "aaa111",
//     stock: 20
//   })

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

    socket.on("message", async data =>{
        messages.push(data)
        io.emit('logs', messages)
        const messageManager = new MessageManager(data.user)
        await messageManager.addMessage(data.user, data.message)
    })
})

