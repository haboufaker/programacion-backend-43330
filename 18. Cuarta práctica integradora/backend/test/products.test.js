import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../src/app.js';
import productService from '../src/services/product.service.js';
import productDAO from '../src/dao/product.dao.js';

const expect = chai.expect;
const request = supertest(app);

chai.use(chaiHttp);

describe('Products Routes', () => {
  let productId; // Store the product's ID for deletion

  // Test the add product route - Successful product addition
  it('should successfully add a product', async () => {
    const productData = {
        title: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        code: 'P1',
        stock: 10,
        category: 'Category 1',
    };

    // Add the product
    const response = await request
      .post('/api/products')
      .send(productData)
      .expect(201); // 201 is the expected status code for successful addition

    // Retrieve the product's ID from MongoDB after addition
    const product = await productDAO.findOne(productData);
    productId = product._id.toString();

    // Assertions for the added product
    expect(product.title).to.equal(productData.title);
    expect(product.description).to.equal(productData.description);
    expect(product.price).to.equal(productData.price);
    expect(product.code).to.equal(productData.code);
    expect(product.stock).to.equal(productData.stock);
    expect(product.category).to.equal(productData.category);
  });

  // Test the get product by ID route - Successful retrieval
  it('should successfully retrieve a product by ID', async () => {
    // Retrieve the product by ID
    const response = await request.get(`/api/products/${productId}`).expect(201);

    // Assertions for the retrieved product
    expect(response.body.existingProduct).to.exist;
    expect(response.body.existingProduct._id).to.equal(productId);
  });

  // Test the update product route - Successful update
  it('should successfully update a product', async () => {
    const updatedProductData = {
      title: 'Updated Product',
      description: 'Updated Description',
      price: 200,
    };

    // Update the product
    await request
      .put(`/api/products/${productId}`)
      .send(updatedProductData)
      .expect(201); // 201 is the expected status code for successful update

    // Retrieve the updated product from MongoDB
    const updatedProduct = await productService.getProductById(productId);

    // Assertions for the updated product
    expect(updatedProduct.title).to.equal(updatedProductData.title);
    expect(updatedProduct.description).to.equal(updatedProductData.description);
    expect(updatedProduct.price).to.equal(updatedProductData.price);
  });

  // Test the delete product route - Successful deletion
  it('should successfully delete a product', async () => {
    // Delete the product
    const response = await request.delete(`/api/products/${productId}`).expect(201);

    // Verify that the product has been deleted
    expect(response.body.Message).to.equal('Product deleted');
  });
});
