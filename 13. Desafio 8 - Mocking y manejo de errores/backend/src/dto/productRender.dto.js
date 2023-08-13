export default class ProductRenderDTO {
    constructor(productRender) {
        this.docs = productRender.docs;
        this.hasPrevPage = productRender.hasPrevPage;
		this.prevPage = productRender.prevPage;
		this.hasNextPage = productRender.hasNextPage;
		this.nextPage = productRender.nextPage;
		this.limit = productRender.limit;
		this.page =productRender.page;
		this.category = productRender.category;
		this.availability = productRender.availability;
		this.showAddToCartButton = productRender.showAddToCartButton;
		this.user = productRender.user;

    }
}