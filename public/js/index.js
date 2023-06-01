document.getElementById('login').onclick = async (e) => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const body = { email, password }
    const result = await fetch('/sessions/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const response = await result.json()
}

// document.getElementById('service').onclick = async (e) => {
//     try {
//         const result = await fetch('http://localhost:8080/jwt/private', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//                 'Authorization': 'Bearer ${localStorage.getItem('authToken')}'
//             }
//         })
//         const response = await result.json()
//         console.log(response)

//     } catch(error) {
//         console.error('Error in Front', error)
//     }
// }