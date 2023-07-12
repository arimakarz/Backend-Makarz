import mongoose from 'mongoose';
import cartModel from '../models/carts.models.js';
import { cartsService } from '../services/service.js';

// //const path = __dirname + '/../carts.json'
// const path ='/Users/arielamakarz/Documents/Coderhouse/Backend/Backend-Makarz/carts.json'

class CartsManager{
    constructor(){
        this.id = -1;
        this.products = [];
        this.model = mongoose.model(cartModel.collectionName, cartModel.schema)
    }

    getCart = async (id) => {
        const results = await this.model.findOne({_id: id}).populate('products.product').lean()
        return results
        // let cart = await cartsService.getById({_id: id})
        // return cart
    }

    createCart = async () => {
        const results = await this.model.create({})
        if (results) return { status: "success", message: "Cart createad!"}
        else return { status: "error", message: "Couldnt create cart."}
    }

    getNewCart = async() => {
        return this.model.findOne({}).sort({_id:-1}).limit(1);
    }

    addToCart = async (cid, pid) => {
        const cart = await this.model.findOne({_id: cid})
        let qty = 1
        if (cart){
            if (cart.products.some(item => item.product._id == pid)) {
                const index = cart.products.findIndex(item => item.product._id == pid);
                qty = cart.products[index].quantity + 1
                cart.products.splice(index, 1)
            }
            cart.products.push( {product: pid, quantity: qty})
            const result = await this.model.updateOne({_id: cid}, cart)
            if (result.modifiedCount > 0) return ({ status: "success", message: "Cart updated"})
            else return ({ status: "error", message: "Error. Cant add product."})
        }else{
            return ({ status: "error", message: "Error. Cant find cart."})
        }
    }

    updateCart = async(cid, products) => {
        const cart = await this.model.find({_id: cid})
        const result = await this.model.updateOne({_id: cid}, {$set: {products: products}})
        if (result.modifiedCount > 0) return ({ status: "sucess", message: "Cart updated"})
        else return ({ status: "error", message: "Error. Cant update cart."})
    }

    updateQuantity = async(cid, pid, qty) => {
        const result = await this.model.updateOne(
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
        const listUpdated = await this.model.updateMany({_id: cid},
            {$pull: {products: {product: pid }}}
        )
        if (listUpdated.modifiedCount >= 1) return ({ status: "success", message: "Product deleted from cart."})
        else return ({ status: "error", message: "Cannot delete product."})
    }

    deleteAll = async(cid) => {
        const result = await this.model.updateOne(
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

export default new CartsManager()