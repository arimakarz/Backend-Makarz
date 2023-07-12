import { Router } from 'express'
import { getAll, setRole, deleteById, deleteInactiveUsers } from '../controllers/users.controller.js'
import { authTokenAdmin } from '../utils.js';

const router = Router()

router.get('/', authTokenAdmin, getAll) 

router.get('/premium/:uid', setRole) 

router.delete('/:uid', deleteById)

router.delete('/', deleteInactiveUsers)

export default router