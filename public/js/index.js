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