import { Router } from 'express'
import { checkout, success, cancel } from '../controllers/payments.controller.js'

const router = Router()

router.get('/checkout', (req, res) => checkout())
router.get('/success', success)
router.get('/cancel', cancel)

export default router