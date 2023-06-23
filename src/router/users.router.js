import { Router } from 'express'
import { getAll, setRole } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getAll) 

router.get('/premium/:uid', setRole) 

export default router