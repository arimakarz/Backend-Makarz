const socket = io()
const buttonSubmit = document.getElementById('newProduct')
const buttonDelete = document.getElementById('deleteProduct')
const id = document.getElementById('idProduct')

buttonSubmit.addEventListener('click', evt => {
    socket.emit('newProduct', 'showProducts')
})

buttonDelete.addEventListener('click', evt => {
    socket.emit('deleteProduct', id.value);
})

socket.on('realTimeProducts', data => {
    let showProducts = document.getElementById("showProducts")
    showProducts.innerHTML = ''
    if (data.result.status == "error"){
        console.log(data.result.message)
    }
    data.productList.forEach(product => {
        showProducts.innerHTML += 
        `<h3>${product.title}</h3> 
        <p>Description: ${ product.description }
        Price: ${ product.price }
        Category: ${ product.category }
        Stock: ${ product.stock }</p>`
    });
})