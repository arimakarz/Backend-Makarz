export const generateErrorInfo = user => {
    return (`
        Uno o más propiedades están incompletas o son inválidas.
        Lista de propiedades obligatorias:
            - FIRST NAME: Must be a string. (${user.first_name || "Sin nombre"})
            - LAST NAME:  Must be a string. (${user.last_name || "Sin apellido"})
            - EMAIL:  Must be a string. (${user.email || "Sin email"})   
            - AGE:  Must be a number. (${user.age || "Sin edad"})   `)
}

export const generateErrorNewProduct = product => {
    return `
        Uno o más propiedades están incompletas o son inválidas. 
        \nLista de propiedades obligatorias:
            - TITLE: Must be a string. (${product.title})
            - DESCRIPTION:  Must be a string. (${product.description})
            - PRICE:  Must be a number. (${product.price})   `
}