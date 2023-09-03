import { mockingProductsModel } from "../models/product.model.js";

class MockingProductDAO {
	
    constructor() {
        this.model = mockingProductsModel;
	    };

    async getProductsForView(sort = false, limit = 10, page = 1, category = false, availability = false) {
        let filter = {};
        
        if (!category && !availability) {
            const products = await this.model.paginate(filter, { lean: true, page, limit });
        } else if (category && availability) {
            filter = { category, availability };
        } else if (category && !availability) {
            filter = { category };
        } else {
            filter = { availability };
        }
        
        const options = { lean: true, page, limit };
        
        const products = await this.model.paginate(filter, options);
        
        let sortOption = {};
        
        if (sort === "asc") {
            sortOption = { price: 1 };
        } else if (sort === "desc") {
            sortOption = { price: -1 };
        }
        
        if (sortOption && products.docs.length > 1) {
            products.docs.sort((a, b) => a.price - b.price);
        }
        return products;
        }

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

            if (existingProduct === null) {
                throw new Error('\nError: Not found\n');
            }

            await this.model.findOneAndDelete({ _id: id });
        } catch(err) {
            console.error(err);
            return 404
        }
    }

    async deleteAll() {
        await this.model.deleteMany({});
    }
};

const mockingProductDAO = new MockingProductDAO();


export default mockingProductDAO