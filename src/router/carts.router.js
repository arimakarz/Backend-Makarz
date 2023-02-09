const { Router } = require('express');
const CartsManager = require('../CartsManager')

const router = Router();
const cartsManager = new CartsManager();

router.post('/', (req, res) => {
    cartsManager.createCart();
})

router.get('/:cid', (req, res) => {
    const { cid } = req.body
    const cart = cartsManager.getCart(cid);
    if (cart.id == -1) res.status(400).send('Cart id not found')
    else res.status(200).json({cart});
})

router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.body
    const response = cartsManager.addToCart(cid, pid);
    if (response.status == "success") res.status(201).json({ response });
    else res.status(400).json(response)
})

module.exports = router