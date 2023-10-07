import productDAO from "../dao/product.dao.js";

class ProductService {
	
    constructor() {
        this.model = productDAO;
	    };

    async getProductsForView(sort, limit, page, category, availability) {
        return await this.model.getProductsForView(sort, limit, page, category, availability)
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

    async deleteProduct(productId) {
        return await this.model.deleteProduct(productId);
    }
};

const productService = new ProductService();


export default productService