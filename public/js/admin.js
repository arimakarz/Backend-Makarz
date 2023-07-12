const buttonDeleteInactiveUsers = document.getElementById('deleteInactiveUsers')
const buttonsDelete = document.getElementsByName('deleteUserById')

if (buttonsDelete) {
    for (var i=0; i < buttonsDelete.length; i++) {
        buttonsDelete[i].addEventListener("click", async (evt) => {
          const uid = evt.target.id
          await fetch(`http://localhost:8080/users/${uid}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        window.location.href = `http://localhost:8080/users/`
      })
    }
  }

buttonDeleteInactiveUsers.addEventListener('click', async() => {
    await fetch('http://localhost:8080/users/', {
        method: 'DELETE'
    })
    .then(res => res.send())    
})