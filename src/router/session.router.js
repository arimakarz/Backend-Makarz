import { Router } from 'express'
import UserModel from '../models/user.model.js'

const router = Router()

router.get('/register', (req, res) => {
    res.render('sessions/register')
})

//Create a user
router.post('/register', async (req, res) => {
    const newUser = req.body
    const user = new UserModel(newUser)

    await user.save()

    res.redirect('/sessions/login')
})

router.get('/login', async (req, res) => {
    if (req.session.user){
        const user = await UserModel.findOne({ email: req.session.user.email }).lean().exec()
        res.redirect('/api/products')
    }else{
        res.render('sessions/login')
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email, password }).lean().exec()
    
    if (!user){
        return res.status(401).render(('errors/base'), {
            error: "Wrong email or password"
        })
    }

    let role = 'user'
    if (email == 'admincoder@coder.com'){
        role = 'admin'
    }
    
    req.session.user = {
        email,
        role
    }

    res.redirect('/api/products')
        
   
})

//Close session

router.get('/logout', (req, res) => {
    if (req.session?.user){
        req.session.destroy(err => {
            if (err){
                res.status(500).render(('errors/base'), {
                    error: err
                })
            }else{
                res.redirect('/sessions/login')
            }
        })
    }else{
        res.send('You are not logged in!')
    }
})

export default router