import mockingProductDAO from "../dao/mockingProduct.dao.js";

class MockingProductService {
	
    constructor() {
        this.model = mockingProductDAO;
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

    async deleteAll() {
        return await this.model.deleteAll();
    }
};

const mockingProductService = new MockingProductService();


export default mockingProductService