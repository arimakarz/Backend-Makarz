import mongoose from 'mongoose'
import productModel from '../models/products.model.js';

class ProductManager{
    constructor(path){
        this.path = path;
        this.products = [];
        this.model = mongoose.model(productModel.collectionName, productModel.schema)
    }

    getProducts = async (page, limit, sort, filter) => {
        //const productsDB = await productModel.find().lean().exec()
        page = page || 1
        limit = limit || 10
        sort = sort || 0
        filter = filter || ''

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
    }

    addProducts = async ({title, description, price, category, status, thumbnails, code, stock}) => {
        await this.getProducts();
        if (!title || !description || !price || !category || !code || !stock){
            console.error(`No se puede agregar el producto ${title}. Faltan datos.`);
            return ({status: "error", message: `Product ${title} can't be added. Information is missing.`});
        }else{
            const existingCode = await this.model.findOne({code: code})
            if (existingCode){
                console.error(`No se puede agregar el producto ${title}. El código ya existe.`)
                return ({status: "error", message: `Product ${title} can't be added. Existing code.`})
            }else{
                await this.model.create({
                    //id: 1,
                    title: title,
                    description: description,
                    price: price,
                    category: category,
                    status: status,
                    thumbnails: thumbnails,
                    code: code,
                    stock: stock
                  })
                console.log('¡Producto agregado!');
                return ({status: "success", message: "Product added!"});
            }
        }
    }

    updateProduct = async (updateProduct) => {
        const result = await this.model.updateOne({_id: updateProduct.id}, {$set: {stock: updateProduct.stock}})
        if (result.modifiedCount > 0) return ({ status: "sucess", message: "Product updated"})
        else return ({ status: "error", message: "Error. Cant update product."})
    }

    deleteProduct = async (id) => {
        console.log(id)
        const deletedProduct = await this.model.deleteOne({_id: id})
        if(deletedProduct.deletedCount == 1){
            return ({ status: "success", message: "Product deleted."})
        }else{
            return ({ status: "error", message: "Cannot delete product. ID not found"})
        }
    }
}

export default new ProductManager()