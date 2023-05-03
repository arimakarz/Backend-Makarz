import mongoose from 'mongoose'
import ticketsModel from '../models/tickets.models.js';
import productManager from '../dao/ProductManager.js'
import cartsManager from './CartsManager.js';
import { sendMail } from '../functions.js'

class TicketsManager{
    constructor(){
        this.products = [];
        const timestamp = {timestamps: {purchase_date: 'created_at'}}
        const ticketsSchema = mongoose.Schema(ticketsModel.schema, timestamp)
        this.model = mongoose.model(ticketsModel.collectionName, ticketsSchema)
    }

    generateTicketNumber = async () => {
        let code = 1
        const tickets = await this.model.find()
        if (tickets){
            code = parseInt(tickets[tickets.length - 1].code) + 1;
        }else{
            code = 1
        }
        return code
    }

    createTicket = async ( cart ) => {
        const code = await this.generateTicketNumber()
        let totalAmount = 0 
        cart.products.map(async (product) => {
            if (this.verifyStock(product.product, product.quantity) == true){
                totalAmount +=product.product.price * product.quantity
                const updateProduct = product.product
                updateProduct.stock -= product.quantity
                const responseUpdate = await productManager.updateProduct(updateProduct)
                const responseRemoveFromCart = await cartsManager.deleteFromCart(cart.id, product.product.id)
            }
        })

        if (totalAmount > 0){
            const results = await this.model.create({
                code: code,
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