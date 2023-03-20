// import fs from 'fs';
import cartModel from '../models/carts.models.js';

// //const path = __dirname + '/../carts.json'
// const path ='/Users/arielamakarz/Documents/Coderhouse/Backend/Backend-Makarz/carts.json'

class CartsManager{
    constructor(){
        this.id = -1;
        this.products = [];
    }

    getCart = async (id) => {
        const results = await cartModel.findOne({_id: id}).populate('products.product').lean()
        // if (results) return { status: "success", payload: results}
        // else return { status: "error", message: "Cant find cart ID."}
        return results
    }

    createCart = async () => {
        const results = await cartModel.create({})
        if (results) return { status: "success", message: "Cart createad!"}
        else return { status: "error", message: "Couldnt create cart."}
        //process.exit(1)
        return results
    }

    addToCart = async (cid, pid) => {
        const cart = await cartModel.findOne({_id: cid})
        if (cart){
            cart.products.push( {product: pid, quantity: 1})
            const result = await cartModel.updateOne({_id: cid}, cart)
            if (result.modifiedCount > 0) return ({ status: "success", message: "Cart updated"})
            else return ({ status: "error", message: "Error. Cant add product."})
        }else{
            return ({ status: "error", message: "Error. Cant find cart."})
        }
    }

    updateCart = async(cid, products) => {
        const cart = await cartModel.find({_id: cid})
        const result = await cartModel.updateOne({_id: cid}, {$set: {products: products}})
        if (result.modifiedCount > 0) return ({ status: "sucess", message: "Cart updated"})
        else return ({ status: "error", message: "Error. Cant update cart."})
    }

    updateQuantity = async(cid, pid, qty) => {
        const result = await cartModel.updateOne(
            { 
                _id: cid, 
                "products.product": pid
            }, 
            {  
                $set: {
                    "products.$.quantity": qty
                }
            }
        )
        if (result.modifiedCount > 0) return ({ status: "success", message: "Quantity updated"})
        else return ({ status: "error", message: "Error. Cant update quantity."})
    }

    deleteFromCart = async (cid, pid) => {
        const listUpdated = await cartModel.updateMany({_id: cid},
            {$pull: {products: {product: pid }}}
        )
        console.log(listUpdated)
        if (listUpdated.modifiedCount >= 1) return ({ status: "success", message: "Product deleted from cart."})
        else return ({ status: "error", message: "Cannot delete product."})
    }

    deleteAll = async(cid) => {
        const result = await cartModel.updateOne(
            { 
                _id: cid
            }, 
            {  
                $set: {
                    products: []
                }
            }
        )
        if (result.modifiedCount >= 1){
            return ({ status: "success", message: "Products removed. The cart now is empty!" })
        }else{
            return ({ status: "error", message: "Products could not be removed" })
        }
    }
}

export default CartsManager