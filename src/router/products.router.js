const { Router, response } = require('express');
const ProductManager = require('../ProductManager.js');

const router = Router();
const productManager = new ProductManager(__dirname + '/../../products.json');

router.get('/', (req, res) => {
    const { limit } = req.query;
    const productsList = productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    res.json({productsList})
});

router.get('/:pid', (req, res) => {
    const { pid } = req.body;
    const product = productManager.getProductById(parseInt(pid));
    res.json({product});
}) 

router.post('/', (req, res) => {
    const newProduct = req.body;
    console.log(newProduct)
    const response = productManager.addProducts(newProduct);
    if (response.status == "success") res.status(201).json(response)
    else res.status(400).json(response);
})

router.put('/:pid', (req, res) => {
    const product = req.body;
    console.log(product)
    const response = productManager.updateProduct(product);
    if (response.status == "success") res.status(200).json({ response });
    else res.status(400).json({response})
})

router.delete('/:pid', (req, res) => {
    const { pid } = req.body;
    const response = productManager.deleteProduct(pid);
    if (response.status == "success") res.status(200).json({response});
    else res.status(400).json(response)
})

module.exports = router