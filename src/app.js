const ProductManager = require('./ProductManager');

const express = require('express');
const app = express();
const productManager = new ProductManager('./products.json');

app.listen(8080, () => { console.log('Server connected!')})

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    const productsList = await productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    res.send({productsList})
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    res.send(product);
}) 

