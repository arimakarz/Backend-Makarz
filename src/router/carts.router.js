import { Router } from 'express';
import { addToCart, createCart, deleteAllFromCart, deleteProductFromCart, getCartById, updateQuantity } from '../controllers/carts.controller.js';
import cartsManager from '../dao/CartsManager.js'

const router = Router();

//Creating a new cart
router.post('/', createCart)

router.get('/:cid', getCartById)

//Adding a product to the cart
router.post('/:cid/products/:pid', addToCart)

//Deleting a product 'pid' from the cart 'cid'
router.delete('/:cid/products/:pid', deleteProductFromCart)

//Update quantity from one product in cart
router.put('/:cid/products/:pid', updateQuantity)

//Delete all products from cart
router.delete('/:cid', deleteAllFromCart)

//UpdateCart
router.put('/:cid', (req, res) => {
    const products = req.body
    const cid = req.query.params
    const result = cartsManager.updateCart(cid, products)
    const updatedCart = cartsManager.getCart(cid)
    if (result.status == "success") res.render('cart', updatedCart)
    else res.status(400).send('Error updating cart.')
})

export default router