import fs from 'fs';

export default class ProductManager {
    #id = 0;
	
    constructor(path) {
        this.path = path
        if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
	    };
    };

	async addProduct(title, description, price, code, stock, thumbnail) {
        try {
            const existingProducts = await this.getProducts();

            const product = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: true,
            }

            if (!product.thumbnail) {
                product.thumbnail = [];
            } else if (Array.isArray(product.thumbnail) !== true || (product.thumbnail.length > 0 && (typeof product.thumbnail[0]) !== "string")) {
                return 400;
            }
            if ((typeof product.title) !== "string" || (typeof product.description) !== "string" || (typeof Math.round(product.price)) !== "number" || (typeof product.code) !== "string" || (typeof Math.round(product.stock)) !== "number") {
                return 400;
            } else if (existingProducts.length === 0) {
                product.id = this.#id;
                existingProducts.push(product)
            } else {
                const existingProductCode = existingProducts.findIndex(existingProduct => existingProduct.code === product.code);

                if (existingProductCode > -1) {
                    console.log("\nError: The product code is already in the database; if you are trying to add a new product, please choose a different code.\n");
                    return 409;
                } else {
                    product.id = this.#getId();
                    existingProducts.push(product);
                }
            }
    
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(existingProducts)
            );
        }
        catch(err) {
            console.log('Error: Could not add product');
        }
    };

    #getId() {
        this.#id++;
        return this.#id
	};

    async getProducts() {
        try {
			const existingProducts = await fs.promises.readFile(
				this.path,
				'utf-8'
			);
			return JSON.parse(existingProducts);
		} catch (err) {
			console.log('\nError: could not get products\n');
		}
    };

   async getProductById(id) {
        try {
            const existingProducts = await this.getProducts();

            const existingProductId = existingProducts.findIndex(existingProduct => existingProduct.id === id);

            if (existingProductId === -1) {
                console.log("\nError: Not found\n");
                return false;
            } else {
                console.log("\nProduct found\n");
                const product = existingProducts[existingProductId];
                return product;
            }
        }
        catch {
            console.log('\nError: could not get product\n');
        }
    };

    async updateProduct(id, objectModifier) {
        try {
            const existingProducts = await this.getProducts();

            const existingProductId = existingProducts.findIndex(existingProduct => existingProduct.id === id);
            console.log(existingProductId);

            if (existingProductId === -1) {
                console.log("\nError: Not found\n");
                return -1;
            };

            const product = existingProducts[existingProductId];
            const existingProductCode = existingProducts.findIndex(existingProduct => existingProduct.code === objectModifier.code);
            let validator = true;
            Object.keys(objectModifier).forEach(key=> {
                if (!((key !== "code" || existingProductCode === -1) &&  Object.hasOwn(product, key) && key !== "id")) {
                    validator = false;
                }
            });
            if (validator) {
                Object.keys(objectModifier).forEach(key=> {
                    product[key] = objectModifier[key];
                });
            } else {
                console.log("\nError: can't update object property, make sure the property exists, you are not trying to modify the product code with an existing one for another product or you are not trying to modify the object's ID\n");
                return 409;
            }
            
            await fs.promises.writeFile(
				this.path,
				JSON.stringify(existingProducts)
			);

        }
        catch {
            console.log('\nError: could not get product\n');
        }
    };

    async deleteProduct(id) {
        try {
            const existingProducts = await this.getProducts();

            const existingProductId = existingProducts.findIndex(existingProduct => existingProduct.id === id);

            if (existingProductId === -1) {
                console.log("\nError: Not found\n");
                return -1;
            } else {
                existingProducts.splice(existingProductId, 1)
            }

            await fs.promises.writeFile(
				this.path,
				JSON.stringify(existingProducts)
			);
        }
        catch {
            console.log('\nError: could not remove product\n');
        }
    }
};