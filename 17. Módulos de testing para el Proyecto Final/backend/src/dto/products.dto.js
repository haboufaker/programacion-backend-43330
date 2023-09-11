export default class ProductDTO {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.code = product.code;
        this.stock = product.stock;
        this.thumbnail = product.thumbnail;
        this.category = product.category;
        this.availability = product.availability;
        this.owner = product.owner;

        if (product.thumbnail && (typeof product.thumbnail) === "string") {
            this.thumbnail = [product.thumbnail]
        }
    }
}