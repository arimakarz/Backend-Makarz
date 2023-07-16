import { Router } from 'express'
import { checkout, success, cancel } from '../controllers/payments.controller.js'

const router = Router()

//Checkout and payment
router.get('/checkout', (req, res) => checkout())

//Success message 
router.get('/success', success)

//Cancel message
router.get('/cancel', cancel)

export default router