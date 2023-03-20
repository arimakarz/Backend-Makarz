// import fs from 'fs';
import productModel from '../models/products.model.js';

class ProductManager{
    constructor(path){
        this.path = path;
        this.products = [];
    }

    // createId = () => {
    //     const countProducts = this.products.length;
    //     if (countProducts === 0){
    //         return 1;
    //     }else{
    //         return (this.products[countProducts - 1].id) + 1;
    //     }
    // }

    getProducts = async (page, limit, sort, filter) => {
        //const productsDB = await productModel.find().lean().exec()
        page = page || 1
        limit = limit || 10
        sort = sort || 0
        filter = filter || ''

        const productsDB = await productModel.paginate(
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
        const product = await productModel.findOne({_id: id})
        console.log(product)
        return product;
    }

    addProducts = async ({title, description, price, category, status, thumbnails, code, stock}) => {
        await this.getProducts();
        if (!title || !description || !price || !category || !code || !stock){
            console.error(`No se puede agregar el producto ${title}. Faltan datos.`);
            return ({status: "error", message: `Product ${title} can't be added. Information is missing.`});
        }else{
            const existingCode = await productModel.findOne({code: code})
            if (existingCode){
                console.error(`No se puede agregar el producto ${title}. El código ya existe.`)
                return ({status: "error", message: `Product ${title} can't be added. Existing code.`})
            }else{
                await productModel.create({
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

    updateProduct = (updateProduct) => {
        this.products = this.getProducts();
        let index = this.products.indexOf(this.products.find((product)=>product.id == updateProduct.id));
        if (index == -1) {
            console.log('No se pudo actualizar el producto');
            return ({status: "error", message: "Cannot update product."})
        }else{
            this.products[index] = updateProduct;
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
            console.log('Producto actualizado existosamente.');
            return ({status: "success", message: "Product updated!"})
        }
    }

    deleteProduct = async (id) => {
        console.log(id)
        const deletedProduct = await productModel.deleteOne({_id: id})
        if(deletedProduct.deletedCount == 1){
            return ({ status: "success", message: "Product deleted."})
        }else{
            return ({ status: "error", message: "Cannot delete product. ID not found"})
        }
    }
}

export default ProductManager