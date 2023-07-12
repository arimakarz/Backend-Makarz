import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
    switch (error.code){
        case EErrors.ROUTING_ERROR:
            res.render('errors/base', { error })
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).render('errors/base', { error })
            break;
        case EErrors.DATABASES_ERROR:
            res.status(403).render('errors/base', { error })
            break;
        case EErrors.UNAUTHORIZATION_ERROR:
            res.status(401).render('errors/base', { error })
            break;
        case EErrors.EMAIL_REGISTERED_ERROR:
            res.status(403).render('errors/base', { error })
            break;
        default:
            res.send({ status: 'error', error: 'Oops. Unhandled error'})
            break;
    }
}