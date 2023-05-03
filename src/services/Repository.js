export default class Repository {
    constructor(dao, model, collectionName) {
        this.dao = dao
        this.model = model
        this.collectionName = collectionName
    }

    get = async(params) => {
        return this.dao.get(params, this.model)
    }

    getById = async(params) => {
        return this.dao.getById(params, this.model, this.collectionName)
    }
}