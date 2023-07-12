import productManager from "../dao/ProductManager.js";
import cartsManager from '../dao/CartsManager.js';
import usersManager from '../dao/UsersManager.js';
import UsersDTO from "../dto/users.js";
import EError from '../services/errors/enums.js';
import CustomError from "../services/errors/custom_error.js";
import { generateErrorNewProduct } from "../services/errors/info.js";
import logger from "../logger.js";
import config from "../config/config.js";
import { sendMail } from "../functions.js";

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
    
    const user = req.user
    if (user){
        results.greetingName = new UsersDTO(req.user).full_name
        const cart = await cartsManager.getNewCart()
        results.cartId = cart._id.valueOf()
        
        if (user.role == 'admin') results.admin = true
        else results.admin = false
        if (user.role == 'premium') results.premium = true
        else results.premium = false
        if (user.role == 'user') results.userRole = true
        else results.userRole = false


        res.render('realTimeProducts', {results, pagination})
    }else{
        const error = CustomError.createError({
            name: 'Session expired',
            cause: "Session expired",
            message: 'The session has expired. Please login again',
            code: EError.UNAUTHORIZATION_ERROR,
            backRoute: '/sessions/login'
        })
        error.statusCode = 500
        
        res.render('errors/base', { error })
    }
}

export async function getProductById(req, res){
    const { pid } = req.params;
    try{
        let product = await productManager.getProductById(pid)
        if (!product.owner) product.isOwner = false
        else if (product.owner.toString() == req.user.user._id) product.isOwner = true
        else product.isOwner = false
        res.render('product', product)
    }catch{ 
        const error = CustomError.createError({
            name: 'Product not found',
            cause: "Invalid product ID",
            message: 'Product not found',
            code: EError.UNAUTHORIZATION_ERROR,
            backRoute: '/api/products'
        })
        error.statusCode = 400
        
        res.render('errors/base', { error })
    }
}

export async function addProduct(req, res){
    const newProduct = req.body;
    newProduct.owner = req.user.user._id
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
        logger.error(error.message)
        
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
    const pid  = req.params.pid;
    const product = await productManager.getProductById(pid)
    const owner = await usersManager.getById(product.owner)
    if (owner.role != 'admin'){
        console.log('dueñi')
        let textMessage = {
            subject: `Producto eliminado`,
            text: `Se ha eliminado el producto ${product.title} de la lista de productos.`
        }
        sendMail(owner, textMessage)
    }
    const response = await productManager.deleteProduct(pid);
    const results = await productManager.getProducts(1,10,0,'')
    if (response.status == "success") res.status(200).render("realTimeProducts", results)
    else res.status(400).json({response})
}