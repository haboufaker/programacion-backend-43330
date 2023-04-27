import fs from 'fs';

export default class ProductManager {
    #id = 0;
	
    constructor() {
        this.path = './products.json'
        if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
	    };
    };

	async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const existingProducts = await this.getProducts();

            const product = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            }

            if (existingProducts.length === 0) {
                product.id = this.#id;
                existingProducts.push(product)
            } else {
                const existingProductCode = existingProducts.findIndex(existingProduct => existingProduct.code === product.code);

                if (existingProductCode > -1) {
                    console.log("\nError: The product code is already in the database; if you are trying to add a new product, please choose a different code.\n");
                    return;
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
                return;
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
                return;
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
                return;
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







const products = new ProductManager();

/**const test = async () => {
	try {
        console.log(await products.getProducts());
		await products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
        console.log(await products.getProducts());
        await products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
		await products.getProductById(0);
        await products.getProductById(1);
        await products.addProduct("producto prueba 2", "Este es un producto prueba 2", 100, "Sin imagen 2", "abc124", 75);
        await products.addProduct("producto prueba 3", "Este es un producto prueba 3", 600, "Sin imagen 3", "abc125", 15);
        await products.addProduct("producto prueba 4", "Este es un producto prueba 4", 300, "Sin imagen 4", "abc126", 25);
        await products.addProduct("producto prueba 5", "Este es un producto prueba 5", 400, "Sin imagen 5", "abc127", 85);
        await products.addProduct("producto prueba 6", "Este es un producto prueba 6", 9999, "Sin imagen 6", "abc128", 10000);
        await products.addProduct("producto prueba 7", "Este es un producto prueba 7", 2, "Sin imagen 7", "abc129", 8);
        await products.addProduct("producto prueba 8", "Este es un producto prueba 8", 22, "Sin imagen 8", "abc129", 88);
        await products.addProduct("producto prueba 9", "Este es un producto prueba 9", 1111, "Sin imagen 9", "abc130", 512);
        await products.addProduct("producto prueba 10", "Este es un producto prueba 10", 2222, "Sin imagen 10", "abc131", 879);

	} catch (err) {
		console.log('\nError: Test failed\n');
	}
};**/