export default class ProductsPageDTO {
    constructor(productsPage) {
        this.status = productsPage.status;
        this.payload = productsPage.payload;
        this.totalPages = productsPage.totalPages;
        this.prevPage = productsPage.prevPage;
        this.nextPage = productsPage.nextPage;
        this.page = productsPage.page;
        this.hasPrevPage = productsPage.hasPrevPage;
        this.hasNextPage = productsPage.hasNextPage;
        this.prevLink = productsPage.prevLink;
        this.nextLink = productsPage.nextLink;
    }
}