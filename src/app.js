const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router');
const ProductManager = require('./ProductManager.js');

const app = express();
const httpServer = app.listen(8080, () => { console.log('Server connected!')})
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

io.on('connection', socket => {
    console.log('New client connected!')
    socket.on("newProduct", data =>{
        const productsList = productManager.getProducts();
        io.emit('realTimeProducts', productsList)
    })

    socket.on('deleteProduct', id => {
        const result = productManager.deleteProduct(id);
        const productList = productManager.getProducts();
        io.emit('realTimeProducts', {
            productList,
            result
        })
    })
})

