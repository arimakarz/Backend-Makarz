import productManager from "../dao/ProductManager.js";
import cartsManager from '../dao/CartsManager.js';
import UsersDTO from "../dto/users.js";
import EError from '../services/errors/enums.js';
import CustomError from "../services/errors/custom_error.js";
import { generateErrorNewProduct } from "../services/errors/info.js";

export async function getProducts(req, res){
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
        query = ""
    }
    
    const results = await productManager.getProducts(page, limit, sort, filter);
    //(limit) ? productsList.splice(limit, (productsList.length - limit)) : productsList;
    //res.json({productsList})
    results.limit = limit
    results.previousLink = results.hasPrevPage ? `/api/products?page=${results.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : ''
    results.nextLink = results.hasNextPage ? `/api/products?page=${results.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : ''

    const pagination = []
    for (let i = 1; i <= results.totalPages; i++){
        pagination.push({
            page: i,
            active: i == results.page
        })
    }
    
    //try{
        //const user = await UserModel.findOne({ email: req.session.user.email})
        const user = req.user
        if (req.session.user){
            results.greetingName = new UsersDTO(req.user.user).full_name
            const cart = await cartsManager.getNewCart()
            results.cartId = cart._id.valueOf()
            
            if (req.session.user.role == 'admin'){
                results.admin = true
            }else{
                results.admin = false
            }
            res.render('realTimeProducts', {results, pagination})
        }else{
            const error = CustomError.createError({
                name: 'Session expired',
                cause: "Session expired",
                message: 'The session has expired. Please log in again',
                code: EError.UNAUTHORIZATION_ERROR,
                backRoute: '/sessions/login'
            })
            error.statusCode = 500
            
            res.render('errors/base', { error })
            //res.send('Error loading user...')
        }
    // }catch (error) {
    //     res.status(401).redirect('/sessions/login')
    // }

}

export async function getProductById(req, res){
    const { pid } = req.params;
    //try{
        const product = await productManager.getProductById(pid);
        res.render('product', product);
    //}catch{ res.status(400).send('Product ID not found.')}
}

export async function addProduct(req, res){
    const newProduct = req.body;

    const response = await productManager.addProducts(newProduct);
    if (response.status == "success"){
        const results = await productManager.getProducts();
        res.status(201).render('realTimeProducts', { results })
    } else {
        const error = CustomError.createError({
            name: 'Product creation error',
            cause: generateErrorNewProduct(newProduct),
            message: response.message,
            code: EError.INVALID_TYPES_ERROR,
            backRoute: '/api/products'
        })
        error.statusCode = 400
        
        res.render('errors/base', { error })
    }
}

export async function updateProduct(req, res){
    const product = req.body;
    const response = await productManager.updateProduct(product);
    if (response.status == "success") res.status(200).json({ response });
    else res.status(400).json({response})
}

export async function deleteProduct(req, res){
    const { pid } = req.body;
    const response = await productManager.deleteProduct(pid);
    const results = await productManager.getProducts(1,10,0,'')
    if (response.status == "success") res.status(200).render("realTimeProducts", results)//res.status(200).json({response});
    else res.status(400).json({response})
}