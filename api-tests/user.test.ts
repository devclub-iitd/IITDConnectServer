import * as request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';

// TEST USER DATA
import {
  testUser1,
  testToken1,
  testUserId1,
  testUser2,
  testToken2,
  testUserId2,
  testUser3,
  testToken3,
  testUserId3,
  testUser4,
  testToken4,
  testUserId4,
  testBody,
} from './testdata';
import {Body} from '../src/models/body';

//Runs after each test
beforeEach(async () => {
  //first clear DataBase before testing next Endpoint
  try {
    await Promise.all([
      User.deleteMany({}),
      Body.deleteMany({}),
      new User(testUser1).save(),
      new User(testUser2).save(),
      new User(testUser3).save(),
      new User(testUser4).save(),
      new Body(testBody).save(),
    ]);
  } catch (err) {
    throw new Error(err);
  }
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
    .send({email: testUser1.email, password: 'testuser1'})
    .expect(200);
});

test('Get Login User Details', async () => {
  await request(app)
    .get('/api//users/' + testUserId1)
    .set('Authorization', 'Bearer ' + testToken1)
    .expect(200);
});

test('Add Super Admin', async () => {
  await request(app)
    .post('/api/users/addSuperAdmin')
    .set('Authorization', 'Bearer ' + testToken1)
    .send({
      clubId: testBody._id,
      userEmail: testUser4.email,
    })
    .expect(200);
  // test user is supersuperadmin , he is adding himself as superadmin
});

test('Add a Admin to Body', async () => {
  await request(app)
    .post('/api/users/addAdmin/')
    .set('Authorization', 'Bearer ' + testToken2)
    .send({
      clubId: testBody._id,
      userEmail: testUser4.email,
    })
    .expect(200);
});

test('Get list of admins', async () => {
  await request(app)
    .post('/api/users/getAdmins')
    .set('Authorization', 'Bearer ' + testToken4)
    .send({clubId: testBody._id})
    .expect(200);
});

test('Allow Remove Admin by superAdmin', async () => {
  await request(app)
    .post('/api/users/removeAdmin')
    .set('Authorization', 'Bearer ' + testToken2)
    .send({
      userEmail: testUser3.email,
      clubId: testBody._id,
    })
    .expect(200);
});
test('Disallow Remove Admin by Admin', async () => {
  await request(app)
    .post('/api/users/removeAdmin')
    .set('Authorization', 'Bearer ' + testToken3)
    .send({
      userEmail: testUser3.email,
      clubId: testBody._id,
    })
    .expect(500);
});
