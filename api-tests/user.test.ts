import * as request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';

// TEST USER DATA
import {testUser, testToken, testUserId, testBody} from './testdata';
import {Body} from '../src/models/body';

//Runs after each test
beforeEach(async () => {
  //first clear DataBase before testing next Endpoint
  await User.deleteMany({});
  await Body.deleteMany({});

  await new User(testUser).save();
  await new Body(testBody).save();
});

// Check signingup of new user
test('Should signup a new user', async () => {
  await request(app)
    .post('/api/signup')
    .send({
      name: 'devdev',
      email: 'dev@gmail.com',
      password: 'devclub',
    })
    .expect(200);
});

// Check Login of Existing User
test('Login for Existing User', async () => {
  await request(app)
    .post('/api/login')
    .send({email: testUser.email, password: 'testuser'})
    .expect(200);
});

test('Get Login User Details', async () => {
  await request(app)
    .get('/api//users/' + testUserId)
    .set('Authorization', 'Bearer ' + testToken)
    .expect(200);
});

test('Add Super Admin', async () => {
  await request(app)
    .post('/api/users/addSuperAdmin')
    .set('Authorization', 'Bearer ' + testToken)
    .send({
      clubId: testBody._id,
      userEmail: testUser.email,
    })
    .expect(200);
  // test user is supersuperadmin , he is adding himself as superadmin
});
