// const socket = io()
const buttonEmptyCart = document.getElementById('emptyCart')
const buttonsRemoveFromCart = document.getElementsByName('removeItem')
const deleteButtons = document.getElementsByName('deleteById')
const buttonDeleteProductById = document.getElementById('deleteProductById')

// buttonSubmit.addEventListener('click', evt => {
//     socket.emit('newProduct', 'showProducts')
// })

// buttonDelete.addEventListener('click', evt => {
//     socket.emit('deleteProduct', id.value);
// })

if (deleteButtons) {
  for (var i=0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", async (evt) => {
        const pid = evt.target.id
        const result = await fetch(`http://localhost:8080/api/products/${pid}`, {
            method: 'DELETE',
        })
        .then(res => {
            res.json()
            window.location.href = `http://localhost:8080/api/products/`
        })
    })
  }
}

buttonDeleteProductById?.addEventListener("click", async (evt) => {
    const pid = evt.target.value
    const result = await fetch(`http://localhost:8080/api/products/${pid}`, {
        method: 'DELETE',
    })
    .then(res => {
        res.json()
        window.location.href = `http://localhost:8080/api/products/`
    })
})

if (buttonsRemoveFromCart) {
    for (var i=0; i < buttonsRemoveFromCart.length; i++) {  
        buttonsRemoveFromCart[i]?.addEventListener("click", async (evt) => {
            const pid = evt.target.id
            const result = await fetch(`${pid}`, {
                method: 'DELETE'
            })
            .then(res => {
                res.json()
                window.location.href = `http://localhost:8080/api/products`
            })
        })
    }
}

buttonEmptyCart?.addEventListener("click", async (evt) => {
    const cid = evt.target.value
    const result = await fetch(`http://localhost:8080/api/carts/${cid}`, {
        method: 'DELETE',
    })
    .then(res => {
        res.json()
        window.location.href = `http://localhost:8080/api/products/`
    })
})