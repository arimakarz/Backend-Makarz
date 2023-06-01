import { Router } from 'express'
import { setRole } from '../controllers/users.controller.js'

const router = Router()

router.get('/premium/:uid', setRole) 

export default router