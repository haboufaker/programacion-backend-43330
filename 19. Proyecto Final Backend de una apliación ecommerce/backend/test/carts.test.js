import supertest from 'supertest';
import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import cartDAO from '../src/dao/cart.dao.js';

chai.use(chaiHttp);
const expect = chai.expect;
const request = supertest(app);

describe('Carts API Tests', () => {
    let cartId;
    let productInCartId;

  // Test the add cart route
  it('should add a new cart', async () => {
    const response = await request
      .post('/api/carts')
      .expect(201); // Expect a 201 status code for successful cart creation

    // Store the cart ID for future tests
    cartId = response.body.cartId;

    // Assertions
    expect(cartId).to.be.a('string'); // Ensure that a cartId is returned and is a string
  });

  // Test the get cart products by ID route
  it('should retrieve cart products by ID', async () => {
    // Assuming you have a valid cartId from a previous test
    const response = await request
      .get(`/api/carts/${cartId}`)
      .expect(200); // Expect a 200 status code for successful retrieval

    // Assertions
    expect(response.body.cart).to.be.an('object'); // Ensure that the response contains a cart object
    // Add more assertions based on the expected structure of the cart object
  });

  // Test adding a product to the cart
  it('should add a product to the cart', async () => {
    // Assuming you have valid cartId and productId values
    const productId = '648626de425075629a9ff499';

    const response = await request
      .post(`/api/carts/${cartId}/products/${productId}`)
      .expect(201); // Expect a 201 status code for success

    const cart = await cartDAO.findById(cartId);
    productInCartId = cart.products[0]._id.toString();
    console.log(productInCartId)
    // Assertions
    // Check the response body for any specific data you expect
    expect(response.body).to.have.property('Message').that.equals('Cart updated');
  });

  // Test updating cart products
  it('should update cart products', async () => {
    // Assuming you have a valid cartId and an array of updated products
    const updatedProducts = [{ product: { _id: '648626de425075629a9ff499' }, quantity: 2 }];

    const response = await request
      .put(`/api/carts/${cartId}`)
      .send({ products: updatedProducts })
      .expect(200); // Expect a 200 status code for success

    // Assertions
    // Check the response body for any specific data you expect
    expect(response.body).to.have.property('Message').that.equals('Cart updated');
  });

  // Test deleting all cart products
  it('should delete all cart products', async () => {
    // Assuming you have a valid cartId
    const response = await request
      .delete(`/api/carts/${cartId}`)
      .expect(201); // Expect a 200 status code for success

    // Assertions
    // Check the response body for any specific data you expect
    expect(response.body).to.have.property('Message').that.equals('cart products updated');
  });
});
