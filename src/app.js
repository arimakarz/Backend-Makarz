import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import chatRouter from './router/chat.router.js';
import ProductManager from'./controllers/ProductManager.js';
import MessageManager from './controllers/MessagesManager.js'
import __dirname from './utils.js';

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', chatRouter);

const uri = 'mongodb+srv://coder:coder@cluster0.wxncseh.mongodb.net/ecommerce';

mongoose.set('strictQuery', false)
mongoose.connect(uri, error => {
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

