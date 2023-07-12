export default class Repository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    get = async(params) => {
        return this.dao.get(params, this.model)
    }
    
    getById = async(params) => {
        return this.dao.getById(params, this.model)
    }

    delete = async(params) => {
        return this.dao.delete(params, this.model)
    }
}