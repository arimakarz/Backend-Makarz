import { Router } from 'express';
import CartsManager from '../controllers/CartsManager.js'

const router = Router();
const cartsManager = new CartsManager();

router.post('/', (req, res) => {
    const response = cartsManager.createCart();
    if (response.status == "success") res.status(201).json({ response })
    else res.status(400).json({ response })
})

router.get('/:cid', (req, res) => {
    const { cid } = req.body
    const response = cartsManager.getCart(cid);
    if (response.id == -1) res.status(400).json({response})
    else res.status(200).json({response});
})

router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.body
    const response = cartsManager.addToCart(cid, pid);
    if (response.status == "success") res.status(201).json({ response });
    else res.status(400).json(response)
})

export default router