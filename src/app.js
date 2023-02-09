const express = require('express');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router');

const app = express();

app.listen(8080, () => { console.log('Server connected!')})

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

