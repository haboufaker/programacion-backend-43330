import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../src/app.js';
import userService from '../src/services/user.service.js';

const expect = chai.expect;

const request = supertest(app);

const authenticatedUser = {
  first_name: 'Juawn2',
  last_name: 'Perewz2',
  email: 'jwuan@perez2.com',
  // Add other relevant user properties here
};

chai.use(chaiHttp);

describe('Sessions Routes', () => {
  let userId; // Store the user's ID for deletion

  // Test the register route - Successful registration
  it('should successfully register a user', async () => {
    const registrationData = {
      first_name: 'Juawn2',
      last_name: 'Perewz2',
      email: 'jwuan@perez2.com',
      password: '123',
      age: 99,
    };

    // Register the user
    const response = await request
      .post('/api/sessions')
      .send(registrationData)
      .expect(302) // Redirect status code
      .expect('Location', '/login');

    // Retrieve the user's ID from MongoDB after registration
    const user = await userService.findOne({ email: 'jwuan@perez2.com' });
    userId = user._id.toString();
  });

  // Test the auth route - Successful authentication
  it('should successfully authenticate a user', async () => {
    const loginData = {
      username: 'jwuan@perez2.com',
      password: '123',
    };

    const response = await request
      .post('/api/sessions/auth')
      .send(loginData)

    expect('Location', '/login');
    expect(302); // Adjust the status code as needed
  });

  // Test the logout route - Successful logout
  it('should successfully log out a user', async () => {
    const res = await request.post('/api/sessions/logout');

    expect(res.status).to.equal(302); // 302 is a redirect status code
    expect(res.header).to.have.property('location').equal('/login');
  });

  // Cleanup: Delete user after tests are done
  after(async () => {
    if (userId) {
      // Send a DELETE request to delete the user by their ID
      const res = await request.delete(`/api/sessions/${userId}`);
      expect(res.status).to.equal(201); // Assuming a 201 status code for successful deletion
    }
  });
});
