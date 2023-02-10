const fs = require('fs');
//const filename = './products.json';

class ProductManager{
    constructor(path){
        this.path = path;
        this.products = [];
    }

    createId = () => {
        const countProducts = this.products.length;
        if (countProducts === 0){
            return 1;
        }else{
            return (this.products[countProducts - 1].id) + 1;
        }
    }

    getProducts = () => {
        let products = [];
        if (fs.existsSync(this.path)){
            products = fs.readFileSync(this.path, 'utf-8')
            this.products = JSON.parse(products);
            return this.products;
        }else{
            console.log('Error al leer el archivo');
            return products;
        }
    }

    getProductById = (id) => {
        const products = this.getProducts();
        return (products.find(product => product.id === id) || {status: "error", message: "Product not found"});
    }

    addProducts = ({title, description, price, category, thumbnails, code, stock}) => {
        this.getProducts();
        if (!title || !description || !price || !category || !code || !stock){
            console.error(`No se puede agregar el producto ${title}. Faltan datos.`);
            return ({status: "error", message: `Product ${title} can't be added. Information is missing.`});
        }else{
            if (this.products.find(product => product.code === code)){
                console.error(`No se puede agregar el producto ${title}. El código ya existe.`)
                return ({status: "error", message: `Product ${title} can't be added. Existing code.`})
            }else{
                const id = this.createId();
                this.products.push({
                    id,
                    title,
                    description,
                    price,
                    category,
                    status: "true",
                    thumbnails,
                    code,
                    stock
                })
                fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
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

    deleteProduct = (id) => {
        this.products = this.getProducts();
        let index = this.products.indexOf(this.products.find((product)=>product.id == id));
        if (index == -1){
            console.log('No se pudo eliminar el producto');
            return ({ status: "error", message: "Cannot delete product. ID not found"})
        }else{
            this.products.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
            console.log('Producto eliminado existosamente');
            return ({ status: "success", message: "Product deleted."})
        }
    }
}

module.exports = ProductManager