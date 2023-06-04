import { productModel } from "../models/product.model.js";

class ProductService {
	
    constructor() {
        this.model = productModel;
	    };

    async getProducts() {
        return await this.model.find();
    }

	async addProduct(product) {
        try {
            if (!product.thumbnail) {
                product.thumbnail = [];
            } else if (Array.isArray(product.thumbnail) !== true || (product.thumbnail.length > 0 && (typeof product.thumbnail[0]) !== "string")) {
                throw new Error('Bad Request');
            }
            if ((typeof product.title) !== "string" || (typeof product.description) !== "string" || (typeof Math.round(product.price)) !== "number" || (typeof product.code) !== "string" || (typeof Math.round(product.stock)) !== "number") {
                throw new Error('Missing required field');
            }
    
            return await this.model.create(product);
        } catch(err) {
            console.error(err);

            return null;
        }
    };

   async getProductById(id) {
        try {
            const existingProduct = await this.model.findById(id)
        
            if (!existingProduct) {
                throw new Error('No document found with the given ID.');
            }

            return existingProduct

        } catch (err) {
            console.error(err);

            return null;
        }
   }

    async updateProduct(id, product) {
        try {
            if (!id) {
                throw new Error('\nError: Not found\n');
            }

            if (Object.keys(product).includes("code")) {
                const existingProductCode = await this.model.find({code: {$eq: product.code}})
                console.log(existingProductCode)
                if (!(existingProductCode === []) || (Object.keys(product).includes("id"))) {
                    throw new Error("Can't update object property, make sure the property exists, you are not trying to modify the product code with an existing one for another product or you are not trying to modify the object's ID");
                }
            }

            await this.model.findByIdAndUpdate(id,product);
        }
        catch(err) {
            console.error(err);
            return 409
        }
    };

    async deleteProduct(id) {
        try {
            if (!id) {
                throw new Error('\nError: Not found\n');
            }
            const existingProduct = await this.getProductById(id);
            console.log(existingProduct)

            if (existingProduct === null) {
                throw new Error('\nError: Not found\n');
            }

            await this.model.findOneAndDelete(id);
        } catch(err) {
            console.error(err);
            return 404
        }
    }
};

const productService = new ProductService();


export default productService