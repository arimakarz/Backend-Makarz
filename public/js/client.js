// const socket = io()
// const buttonSubmit = document.getElementById('newProduct')
// const buttonDelete = document.getElementById('deleteProduct')
// const buttonDeleteById = document.getElementById('deleteById')
const buttonDeleteProductById = document.getElementById('deleteProductById')
// const buttonAddToCart = document.getElementById('addToCart')
// const id = document.getElementById('idProduct')

// console.log('hola')

// buttonSubmit.addEventListener('click', evt => {
//     socket.emit('newProduct', 'showProducts')
// })

// buttonDelete.addEventListener('click', evt => {
//     socket.emit('deleteProduct', id.value);
// })

// buttonDeleteById.addEventListener('click', evt => {
//     socket.emit('deleteProductById', evt.target.id);
// })

buttonDeleteProductById.addEventListener('click', async (evt) => {
    const pid = evt.target.value
    console.log(pid)
    await fetch(`/api/products/${pid}`, {
        method: 'DELETE',
        body: JSON.stringify(pid),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    // .then(res => console.log(res))
    //socket.emit('deleteProductById', evt.target.value);
})

// buttonAddToCart.addEventListener('click', evt => {
//     socket.emit('addToCart', evt.target.id);
// })

// socket.on('realTimeProducts', data => {
//     let showProducts = document.getElementById("showProducts")
//     showProducts.innerHTML = ''

//     if (data.result.status == "error"){
//         console.log(data.result.message)
//         alert(data.result.message)
//     }
//     data.productList.forEach(product => {
//         showProducts.innerHTML += 
//         `<h3>${product.title}</h3> 
//         <p>Description: ${ product.description }
//         Price: ${ product.price }
//         Category: ${ product.category }
//         Stock: ${ product.stock }</p>`
//     });
// })