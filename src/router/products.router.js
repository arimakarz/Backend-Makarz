//import productModel from '../models/products.model.js';
import { Router} from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = Router();
//const productManager = new ProductManager(__dirname + '/../../products.json');
const productManager = new ProductManager('/Users/arielamakarz/Documents/Coderhouse/Backend/Backend-Makarz/products.json')

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const productsList = await productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})
    res.render('index', {
        title: "Products",
        productList: productsList
    })
});

router.get('/realtimeproducts', async (req, res) => {
    const { limit } = req.query;
    const productsList = await productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})
    res.render('realTimeProducts', {
        title: "Products",
        productList: productsList
    })
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    console.log(product)
    res.json({product});
}) 

router.post('/', (req, res) => {
    const newProduct = req.body;
    console.log(newProduct)
    const response = productManager.addProducts(newProduct);
    if (response.status == "success") res.status(201).json({response})
    else res.status(400).json({response});
})

router.put('/:pid', (req, res) => {
    const product = req.body;
    console.log(product)
    const response = productManager.updateProduct(product);
    if (response.status == "success") res.status(200).json({ response });
    else res.status(400).json({response})
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.body;
    const response = await productManager.deleteProduct(pid);
    if (response.status == "success") res.status(200).json({response});
    else res.status(400).json({response})
})

router.post('/realtimeproducts', async (req, res) => {
    const newProduct = req.body;
    const response = await productManager.addProducts(newProduct);
    const productsList = await productManager.getProducts();
    res.render('realTimeProducts', {
        title: 'Products',
        productList: productsList,
        result: response
    })
})

export default router