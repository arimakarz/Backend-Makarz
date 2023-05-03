import MongoDAO from "../dao/MongoDAO.js";
import ProductService from "./products.js";
import CartService from "./carts.js";
import config from "../config/config.js";

let dao
switch (config.app.persistence) {
    case "MONGO":
        dao = new MongoDAO(config.app.uri, config.app.dbName)
        break;

    default:
        break;
}

export const productService = new ProductService(dao)
export const cartsService = new CartService(dao)