import fs from 'fs';

export default class CartManager {
    #id = 0;

    constructor(path) {
        this.path = path
        if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
	    };
    };

	async addCart() {
        try {
            const existingCarts = await this.getCarts();

            const cart = {
                products: [],
            }
            if (existingCarts.length === 0) {
                cart.id = this.#id;
                existingCarts.push(cart)
            } else {
            cart.id = this.#getId();
            existingCarts.push(cart);
            }
            
            await fs.promises.writeFile(
				this.path,
				JSON.stringify(existingCarts)
			);
        }
        catch(err) {
            console.log('Error: Could not add cart');
        }
    };

    #getId() {
        this.#id++;
        return this.#id
	};

    async getCarts() {
        try {
			const existingProducts = await fs.promises.readFile(
				this.path,
				'utf-8'
			);
			return JSON.parse(existingProducts);
		} catch (err) {
			console.log('\nError: could not get carts\n');
		}
    };

   async getCartProductsById(id) {
        try {
            const existingCarts = await this.getCarts();

            const existingCartId = existingCarts.findIndex(existingCart => existingCart.id === id);

            if (existingCartId === -1) {
                console.log("\nError: Not found\n");
                return false;
            } else {
                console.log("\nCart found\n");
                const cart = existingCarts[existingCartId];
                return cart.products;
            }
        }
        catch {
            console.log('\nError: could not get cart\n');
        }
    };

    async addProductById(cartId, productId) {
        try {
            const existingCarts = await this.getCarts();
            const existingCartId = existingCarts.findIndex(existingCart => existingCart.id === cartId);
            let existingCartProducts = await this.getCartProductsById(cartId);

            if (existingCartProducts === false) {
                return 404;
            }
            const existingCartProductId = existingCartProducts.findIndex(existingProduct => existingProduct.product === productId);

            if (existingCartProductId === -1) {
                const product = {
                    product: productId,
                    quantity: 1
                };
                existingCartProducts.push(product)
                existingCarts[existingCartId].products = existingCartProducts

                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(existingCarts)
                );

                return 200
            } else {
                existingCartProducts[existingCartProductId].quantity++;
                existingCarts[existingCartId].products = existingCartProducts

                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(existingCarts)
                );
                return 201
            }
        }
        catch {
            console.log('\nError: could not add product\n');
        }
    };
};