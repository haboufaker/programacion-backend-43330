import productDAO from "../dao/product.dao.js";

class ProductService {
	
    constructor() {
        this.model = productDAO;
	    };

    async getProductsForView(sort = false, limit = 10, page = 1, category = false, availability = false) {
        return await this.model.getProductsForView(sort = false, limit = 10, page = 1, category = false, availability = false)
        }

    async getProducts() {
        return await this.model.getProducts();
    }

    async addProduct(product) {
        return await this.model.addProduct(product);
    };

    async getProductById(id) {
        return await this.model.getProductById(id);
    }

    async updateProduct(id, product) {
        return await this.model.updateProduct(id, product);
    };

    async deleteProduct(id) {
        return await this.model.deleteProduct(id);
    }
};

const productService = new ProductService();


export default productService