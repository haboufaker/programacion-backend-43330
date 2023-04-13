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
            this.products.forEach(existingProduct => {
                if (existingProduct.code === product.code) {
                    console.log("Error: The product code is already in the database; if you are trying to add a new product, please choose a different code.");
                } else {
                    product.id = this.#getId();
                    this.products.push(product);
                }
            });
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
            console.log("Error: Not found");
            return;
        };

        console.log("Product found");
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
productManager.getProducts();
productManager.getProductById(0);
productManager.getProductById(1);
productManager.getProductById(2);
productManager.getProductById(3);
