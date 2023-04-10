import { Router} from 'express';
import CartsManager from '../dao/CartsManager.js';
import ProductManager from '../dao/ProductManager.js';
import UserModel from '../models/user.model.js';

const router = Router();
//const productManager = new ProductManager(__dirname + '/../../products.json');
const productManager = new ProductManager('/Users/arielamakarz/Documents/Coderhouse/Backend/Backend-Makarz/products.json')
const cartsManager = new CartsManager()

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let sort = parseInt(req.query.sort);
    let query = req.query.query;
    let filter = {}

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort) sort = 0
    
    if (query){
        if (query == '1'){
            filter = { stock: {$gt: 0} }
        }else{
            filter = ({category: query})
        }
    }else{
        query=""
    }
    
    const results = await productManager.getProducts(page, limit, sort, filter);
    //(limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})

    results.previousLink = results.hasPrevPage ? `/api/products?page=${results.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : ''
    results.nextLink = results.hasNextPage ? `/api/products?page=${results.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : ''
    
    try{
        const user = await UserModel.findOne({ email: req.session.user.email})
        if (user){
            results.greetingName = user.first_name
            //results.cartId = user.cartId
            
            const cart = await cartsManager.getNewCart()
            results.cartId = cart._id.valueOf()
            
            if (req.session.user.role == 'admin'){
                results.admin = true
            }else{
                results.admin = false
            }
            res.render('realTimeProducts', results)
        }else{
            res.send('Error loading user...')
        }
    }catch (error) {

        console.log('errro')
        res.status(401).redirect('/sessions/login')
    }

});

router.get('/realtimeproducts', async (req, res) => {
    const { limit } = req.query;
    const productsList = await productManager.getProducts();
    (limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})
    res.render('realTimeProducts', productsList)
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try{
        const product = await productManager.getProductById(pid);
        res.render('product', product);
    }catch{ res.status(400).send('Product ID not found.')}
    //console.log(product)
    //res.json({product});
}) 

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const response = await productManager.addProducts(newProduct);
    const productsList = await productManager.getProducts();
    if (response.status == "success") res.status(201).render('realTimeProducts',productsList)
    else res.status(400).json({response});
})

router.put('/:pid', (req, res) => {
    const product = req.body;
    const response = productManager.updateProduct(product);
    if (response.status == "success") res.status(200).json({ response });
    else res.status(400).json({response})
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.body;
    const response = await productManager.deleteProduct(pid);
    const results = await productManager.getProducts(1,10,0,'')
    if (response.status == "success") res.status(200).render("realTimeProducts", results)//res.status(200).json({response});
    else res.status(400).json({response})
})

router.post('/realtimeproducts', async (req, res) => {
    const newProduct = req.body;
    const response = await productManager.addProducts(newProduct);
    const productsList = await productManager.getProducts();
    res.render('realTimeProducts', productsList)
})

export default router