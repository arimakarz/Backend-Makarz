import ticketsManager from '../dao/TicketsManager.js'
import cartsManager from '../dao/CartsManager.js'
import { checkout } from '../controllers/payments.controller.js'

export async function purchaseCart(req, res){
    const { cid } = req.params
    const user = req.user

    const cart = await cartsManager.getCart(cid)
    cart.user = user
    const response = await ticketsManager.createTicket( cart );
    if (response.status == "success"){
        const session = await checkout(cart)
        res.redirect(session.url)
        //res.status(201).redirect('/api/products')
    } 
    else res.status(400).render('errors/base', { response })
}