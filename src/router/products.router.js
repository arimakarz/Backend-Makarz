import { Router} from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import productManager from '../dao/ProductManager.js';

const router = Router();

router.get('/', getProducts)

router.get('/realtimeproducts', async (req, res) => {
    const { limit } = req.query;
    const productsList = await productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})
    res.render('realTimeProducts', productsList)
});

router.get('/:pid', getProductById)

router.post('/', addProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

router.post('/realtimeproducts', async (req, res) => {
    const newProduct = req.body;
    const response = await productManager.addProducts(newProduct);
    const productsList = await productManager.getProducts();
    res.render('realTimeProducts', productsList)
})

export default router