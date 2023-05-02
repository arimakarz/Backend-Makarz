import cartsManager from '../dao/CartsManager.js'

export async function createCart (req, res) {
    const response = await cartsManager.createCart();
    if (response.status == "success"){
        res.status(201).redirect('/api/products')
    } 
    else res.status(400).json({ response })
}

export async function getCartById(req, res){
    const { cid } = req.params
    try{
        const response = await cartsManager.getCart(cid);
        const productsArray = response.products
        res.status(200).render('cart', {productsArray, cid})
    }catch{ res.status(400).send("Cart ID not found.")}
}

export async function addToCart (req, res){
    const { cid, pid } = req.params
    const response = await cartsManager.addToCart(cid, pid);

    const cartUpdated = await cartsManager.getCart(cid);
    const productsArray = cartUpdated.products
    res.render('cart', {productsArray, cid})
}

export async function deleteProductFromCart(req, res){
    const { cid, pid } = req.body
    const result = await cartsManager.deleteFromCart(cid, pid)
    if (result.status == "error") res.status(400).send('Product not removed from cart...')
    else res.status(200).send("Cart updated. Item removed!")
}

export async function updateQuantity(req, res){
    let { cid, pid, qty } = req.body
    const result = await cartsManager.updateQuantity(cid, pid, qty)
    if (result.status == "success") res.status(200).send(result.message)
    else res.status(400).send(result.message)
}

export async function deleteAllFromCart(req, res){
    const {cid} = req.body
    const result = await cartsManager.deleteAll(cid)
    if (result.status == "success") res.status(200).send(result.message)
    else res.status(400).send(result.message)
}