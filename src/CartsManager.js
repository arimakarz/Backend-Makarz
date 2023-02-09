const fs = require('fs');

const path = __dirname + '/../carts.json'

class CartsManager{
    constructor(){
        this.id = -1;
        this.products = [];
    }

    getCart = (id) => {
        console.log(path)
        if (fs.existsSync(path)){
            const carts = JSON.parse(fs.readFileSync(path, 'utf-8'));
            return (carts.find(cart => cart.id == id) || {id: -1, status: "error", message: "Cart id not found"});
        }else{
            console.log('Error al leer el archivo');
            return { status: "error", message: "Error"};
        }
    }

    createCart = () => {
        let id = 0;
        if (fs.existsSync(path)){
            let carts = JSON.parse(fs.readFileSync(path, 'utf-8'))
            const countCarts = carts.length;
            if (countCarts === 0){
                id = 1;
            }else{
                id = (carts[countCarts - 1].id) + 1;
            }
            carts.push({id: id, products: []})
            fs.writeFileSync(path, JSON.stringify(carts, null, 2));
            console.log('Carrito creado!');
            return ({status: "success", message: "Cart created!"});
        }else{
            console.log('Error al leer el archivo');
            return ({status: "error", message: "Error: cannot create cart"})
        }
    }

    addToCart = (cid, pid) => {
        let carts = JSON.parse(fs.readFileSync(path, 'utf-8'))
        let index = carts.indexOf(carts.find((cart)=>cart.id == cid));
        let message = ''
        if (index == -1) {
            console.log('No se pudo agregar el producto');
            return ({status: "error", message: "Cannot find cart ID."})
        }else{
            let indexProduct = carts[index].products.indexOf(carts[index].products.find(item => item.product == pid))
            console.log(indexProduct)
            if (indexProduct == -1){
                carts[index].products.push({ product: pid, quantity: 1 })
                message = 'Product added to cart!'
            }else{
                let newQuantity = carts[index].products[indexProduct].quantity + 1;
                carts[index].products[indexProduct] = { product: pid, quantity: newQuantity }
                message = 'Quantity updated!'
            }
            fs.writeFileSync(path, JSON.stringify(carts, null, 2));
            return ({status: "success", message: message})
        }
        
    }
}

module.exports = CartsManager