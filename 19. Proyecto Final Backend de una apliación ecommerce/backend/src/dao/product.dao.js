import { productModel } from "../models/product.model.js";

class ProductDAO {
	
    constructor() {
        this.model = productModel;
	    };

    async getProductsForView(sort = false, limit = 10, page = 1, category = false, availability = false) {
        let filter = {};
    
        if (category && availability) {
            filter = { category, availability };
        } else if (category) {
            filter = { category };
        } else if (availability) {
            filter = { availability };
        }
    
        const options = {
            lean: true,
            page,
            limit,
        };
    
        if (sort) {
            // Define the sorting option based on the 'sort' parameter
            const sortOption = {};
            if (sort === "asc") {
                sortOption.price = 1;
            } else if (sort === "desc") {
                sortOption.price = -1;
            }
            options.sort = sortOption; // Apply sorting if 'sort' parameter is provided
        }
    
        try {
            const products = await this.model.paginate(filter, options);
    
            return products;
        } catch (err) {
            console.error(err);
            throw err; // Rethrow the error for the calling function to handle
        }
    }
        

    async getProducts() {
        return await this.model.find();
    }

    async addProduct(product) {
        try {
            if (!product.thumbnail) {
                product.thumbnail = [];
            } else if (Array.isArray(product.thumbnail) !== true && (typeof product.thumbnail) !== "string" || (typeof product.thumbnail[0]) !== "string") {
                throw new Error('Bad Request');
            }

            if (typeof product.thumbnail === "string") {
                let x = product.thumbnail;
                product.thumbnail = Array.from(x.split(","));
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
                console.log(product)
                console.log(existingProductCode)
                if (!(existingProductCode == []) || (Object.keys(product).includes("id"))) {
                    throw new Error("Can't update object property, make sure the property exists, you are not trying to modify the product code with an existing one for another product or you are not trying to modify the object's ID");
                }
            }

            if ( product.thumbnail && (typeof product.thumbnail) ==='string') {
                const existingProductCode = await this.model.find({code: {$eq: product.code}})
                let x = product.thumbnail
                let y = Array.from(x.split(","));
                product.thumbnail = existingProductCode.thumbnail.concat(y)
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
                throw new Error('Invalid ID');
            }
    
            // Delete the product by ID
            await this.model.findByIdAndDelete(id);
        } catch (err) {
            console.error(err);
            return 404; // Return a proper error code
        }
    }

    async findOne(product) {
		return await this.model.findOne({ code: product.code});
	}
};

const productDAO = new ProductDAO();


export default productDAO