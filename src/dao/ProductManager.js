import mongoose from 'mongoose'
import productModel from '../models/products.model.js';
import {productService} from '../services/service.js';
import CustomError from '../services/errors/custom_error.js';
import EError from '../services/errors/enums.js';
import { generateErrorNewProduct } from "../services/errors/info.js";
import logger from '../logger.js';

class ProductManager{
    constructor(path){
        this.path = path;
        this.products = [];
        this.model = mongoose.model(productModel.collectionName, productModel.schema)
    }

    getProducts = async (page, limit, sort, filter) => {
        if (!page) page = 1
        if (!limit) limit = 10
        if (!sort) sort = 0
        if (!filter) filter = {}

        const productsDB = await this.model.paginate(
            filter, 
            {
                page, 
                limit, 
                sort: {
                    "price": sort
                },
                lean: true
            } 
        )
        if (productsDB) productsDB.status = "success"
        else productsDB.status = "error"
        return productsDB;
    }

    getProductById = async (id) => {
        const product = await this.model.findOne({_id: id})
        return product;
        // let product = await productService.getById({_id: id})
        // return product
    }

    addProducts = async ({title, description, price, category, status, thumbnails, code, stock, owner}) => {
        await this.getProducts();
        if (!title || !description || !price || !category || !code || !stock){
            logger.error(`No se puede agregar el producto ${title}. Faltan datos.`);
            return ({ status: "error", message: `Product can't be added. Information is missing.` });
        }else{
            if ((parseInt(price) > 0) && (parseInt(stock) > 0)){
                const existingCode = await this.model.findOne({code: code})
                if (existingCode){
                    console.error(`No se puede agregar el producto ${title}. El código ya existe.`)
                    return ({ status: "error", message: `Product ${title} can't be added. Existing code.` })
                }else{
                    await this.model.create({
                        title: title,
                        description: description,
                        price: parseInt(price),
                        category: category,
                        status: status,
                        thumbnails: thumbnails,
                        code: code,
                        stock: parseInt(stock),
                        owner: owner
                    })
                    logger.info('Producto agregado')
                    return ({status: "success", message: "Product added!"});
                }
            }else{
                return ({ status: "error", message: `Product ${title} can't be added. Invalid types.` })
            }
        }
    }

    updateProduct = async (updateProduct) => {
        //const result = await this.model.updateOne({_id: new ObjectId(updateProduct.id)}, updateProduct)
        const result = await this.model.updateOne({_id: updateProduct.id}, updateProduct)
        if (result.modifiedCount > 0) return ({ status: "sucess", message: "Product updated"})
        else return ({ status: "error", message: "Error. Cant update product."})
    }

    deleteProduct = async (id) => {
        const deletedProduct = await this.model.deleteOne({_id: id})
        if(deletedProduct.deletedCount == 1) return ({ status: "success", message: "Product deleted."})
        return ({ status: "error", message: "Cannot delete product. ID not found"})
    }
}

export default new ProductManager()