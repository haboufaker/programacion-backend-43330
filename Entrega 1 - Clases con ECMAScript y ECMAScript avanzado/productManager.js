class ProductManager {
    #id = 0;
	
    constructor() {
		this.products = [];
	}

	addProduct(title, description, price, thumbnail, code, stock) {
		const product = {
			title: title,
			description: description,
			price: price,
			thumbnail: thumbnail,
			code: code,
			stock: stock,
		};
        if ( this.products.length === 0) {
            product.id = this.#id;
            this.products.push(product);
        } else {
            const existingProductCode = this.products.findIndex(existingProduct => existingProduct.code === product.code);

            if (existingProductCode > -1) {
                console.log("\nError: The product code is already in the database; if you are trying to add a new product, please choose a different code.\n");
                return;
            } else {
                product.id = this.#getId();
                this.products.push(product);
            }
        };
    };

    #getId() {
        this.#id++;
        return this.#id
	};

    getProducts() {
        console.log(this.products);
        return this.products;
    };

   getProductById(id) {
        const existingProductId = this.products.findIndex(existingProduct => existingProduct.id === id);

        if (existingProductId === -1) {
            console.log("\nError: Not found\n");
            return;
        };

        console.log("\nProduct found\n");
        const product = this.products[id];
        console.log(product);
    };
};

const productManager = new ProductManager();
productManager.getProducts();
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
productManager.getProducts();
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
productManager.getProductById(0);
productManager.getProductById(1);
productManager.addProduct("producto prueba 2", "Este es un producto prueba 2", 100, "Sin imagen 2", "abc124", 75);
productManager.addProduct("producto prueba 3", "Este es un producto prueba 3", 600, "Sin imagen 3", "abc125", 15);
productManager.addProduct("producto prueba 4", "Este es un producto prueba 4", 300, "Sin imagen 4", "abc126", 25);
productManager.addProduct("producto prueba 5", "Este es un producto prueba 5", 400, "Sin imagen 5", "abc127", 85);
productManager.addProduct("producto prueba 5", "Este es un producto prueba 5", 400, "Sin imagen 5", "abc127", 85);
productManager.getProducts();
productManager.getProductById(0);
productManager.getProductById(1);
productManager.getProductById(2);
productManager.getProductById(8);
productManager.getProductById(10);
productManager.getProductById(12);