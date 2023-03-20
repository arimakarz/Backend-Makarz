import { Router } from 'express';
import mongoose from 'mongoose';
import CartsManager from '../dao/CartsManager.js'
import cartModel from '../models/carts.models.js';


const router = Router();
const cartsManager = new CartsManager();

//Creating a new cart
router.post('/', async (req, res) => {
    const response = await cartsManager.createCart();
    if (response.status == "success") res.status(201).json({ response })
    else res.status(400).json({ response })
})

router.get('/:cid',  async (req, res) => {
    const { cid } = req.params
    //const cid = '64150d8d0b859a25e0d24160'
    //const cid = '64150d33296d5a29a30799b1'
    try{
        const response = await cartsManager.getCart(cid);
        const productsArray = response.products
        res.status(200).render('cart', {productsArray})
    }catch{ res.status(400).send("Cart ID not found.")}
    // if (!response) response.json({response})
    // else res.render('cart', productsList)
})

//Adding a product to the cart
router.post('/:cid/products/:pid', async (req, res) => {
    //const { cid, pid } = req.body
    const { cid, pid } = req.params
    const response = await cartsManager.addToCart(cid, pid);

    const cartUpdated = await cartsManager.getCart(cid);
    const productsArray = cartUpdated.products
    res.render('cart', {productsArray})
})

//Deleting a product 'pid' from the cart 'cid'
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.body
    const result = await cartsManager.deleteFromCart(cid, pid)
    if (result.status == "error") res.status(400).send('Product not removed from cart...')
    else res.status(200).send("Cart updated. Item removed!")
})

router.put('/:cid', (req, res) => {
    const products = req.body
    const cid = req.query.params
    const result = cartsManager.updateCart(cid, products)
    const updatedCart = cartsManager.getCart(cid)
    if (result.status == "success") res.render('cart', updatedCart)
    else res.status(400).send('Error updating cart.')
})

//Update quantity from one product in cart
router.put('/:cid/products/:pid', async (req, res) => {
    let { cid, pid, qty } = req.body
    //const { cid, pid } = req.params 
    const result = await cartsManager.updateQuantity(cid, pid, qty)
    if (result.status == "success") res.status(200).send(result.message)
    else res.status(400).send(result.message)
})

//Delete all products from cart
router.delete('/:cid', async (req, res) => {
    const {cid} = req.body
    const result = await cartsManager.deleteAll(cid)
    //res.render('cart', result)
    if (result.status == "success") res.status(200).send(result.message)
    else res.status(400).send(result.message)
})

export default router