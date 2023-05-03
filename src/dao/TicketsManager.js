import mongoose from 'mongoose'
import ticketsModel from '../models/tickets.models.js';
import productManager from '../dao/ProductManager.js'
import { sendMail } from '../functions.js'

class TicketsManager{
    constructor(){
        this.products = [];
        const timestamp = {timestamps: {purchase_date: 'created_at'}}
        const ticketsSchema = mongoose.Schema(ticketsModel.schema, timestamp)
        this.model = mongoose.model(ticketsModel.collectionName, ticketsSchema)
    }

    createTicket = async ( cart ) => {
        let totalAmount = 0 
        const productWithoutStock = []
        cart.products.map(async (product) => {
            if (this.verifyStock(product.product, product.quantity) == true){
                totalAmount +=product.product.price * product.quantity
                const updateProduct = product.product
                updateProduct.stock -= product.quantity
                const responseUpdate = await productManager.updateProduct(updateProduct)
                const responseRemoveFromCart = await cartsManager.deleteFromCart(cart.id, product.product.id)
            }else{
                productWithoutStock.push(product.product)
            }
        })

        if (totalAmount > 0){
            const results = await this.model.create({
                amount: totalAmount,
                purchaser: cart.user.email
            })
        
            if (results){
                let textMessage = {
                    subject: '¡Compra confirmada!',
                    text: 'Gracias por comprar con nostros. Próximamente podrá disfrutar de nuestros productos'
                }
                sendMail(cart.user, textMessage)
                return { status: "success", message: "Cart purchased!"}
            } 
            else return { status: "error", message: "Couldn't purchase cart."}
        }else return { status: "error", message: "Oh no! There are no items in stock."}
    }

    verifyStock = ( product, quantity ) => {
        if ( product.stock >= quantity ) return true
        else return false
    }
}

export default new TicketsManager