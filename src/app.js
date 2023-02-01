const ProductManager = require('./ProductManager');

const express = require('express');
const app = express();
const productManager = new ProductManager('./products.json');

app.listen(8080, () => { console.log('Server connected!')})

app.get('/products', (req, res) => {
    const { limit } = req.query;
    const productsList = productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    res.send({productsList})
});

app.get('/products/:pid', (req, res)=>{
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid));
    res.send(product);
}) 

