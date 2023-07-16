import Stripe from 'stripe'
import { config } from 'dotenv'
config()

const stripe = new Stripe(process.env.PASS_STRIPE_SECRET)

//Checkout and payment
export const checkout = async (cart) => {

    let line_items = []

    cart.products.map((item) => {
        const itemToAdd = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.title,
                    description: item.product.description,
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        }
        line_items.push(itemToAdd)
    })

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: '/payment/success',
        cancel_url: '/payment/cancel'
    })
    return session
}

export const success = (req, res) => {
    const data = {
        status: "¡Gracias por su compra!",
        message: "Compra realizada con éxito. Verificá tu casilla de email para ver la información de entrega de su compra."
    }
    res.render('payments', data)
}

export const cancel = (req, res) => {
    const data = {
        status: "Compra cancelada",
        message: "¡Qué lástima! Si te arrepientes, puedes volver a comprar con nostros."
    }
    res.render('payments', data)
}