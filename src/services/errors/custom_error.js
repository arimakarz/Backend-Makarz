export default class CustomError {
    static createError({ name='Error', cause, message, code, backRoute }) {
        const error = new Error(message, { cause })
        error.name = name
        error.code = code
        error.backTo = backRoute
        return error
    }
}