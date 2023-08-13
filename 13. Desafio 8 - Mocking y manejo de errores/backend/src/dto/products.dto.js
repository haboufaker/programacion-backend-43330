export default class ProductDTO {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.code = product.price;
        this.stock = product.stock;
        this.thumbnail = product.thumbnail;
        this.category = product.category;
        this.availability = product.availability;
    }
}