import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import User from '../src/models/user';
import * as bcrypt from 'bcryptjs';
import {Body} from '../src/models/body';

const testBodyId = new mongoose.Types.ObjectId();

const testUserId1 = new mongoose.Types.ObjectId();
const testToken1 = jwt.sign(
  {id: testUserId1},
  process.env.JWT_SECRET || 'thisismytestsecret'
);
const testUser1 = new User({
  _id: testUserId1,
  name: 'testUser1',
  email: 'testuser1@gmail.com',
  password: bcrypt.hashSync('testuser1', 10),
  superSuperAdmin: true,
});

const testUserId2 = new mongoose.Types.ObjectId();
const testToken2 = jwt.sign(
  {id: testUserId2},
  process.env.JWT_SECRET || 'thisismytestsecret'
);
const testUser2 = new User({
  _id: testUserId2,
  name: 'testUser2',
  email: 'testuser2@gmail.com',
  password: bcrypt.hashSync('testuser2', 10),
  superAdminOf: [testBodyId],
});
const testUserId3 = new mongoose.Types.ObjectId();
const testToken3 = jwt.sign(
  {id: testUserId3},
  process.env.JWT_SECRET || 'thisismytestsecret'
);
const testUser3 = new User({
  _id: testUserId3,
  name: 'testUser3',
  email: 'testuser3@gmail.com',
  password: bcrypt.hashSync('testuser3', 10),
  adminOf: [testBodyId],
});
const testUserId4 = new mongoose.Types.ObjectId();
const testToken4 = jwt.sign(
  {id: testUserId4},
  process.env.JWT_SECRET || 'thisismytestsecret'
);
const testUser4 = new User({
  _id: testUserId4,
  name: 'testUser4',
  email: 'testuser4@gmail.com',
  password: bcrypt.hashSync('testuser4', 10),
});
const testBody = new Body({
  _id: testBodyId,
  name: 'testBody',
  about: 'this is test body',
  caption: 'testing api-endpoints',
  typeOfBody: 1,
  superAdmin: testUserId2,
  admins: [testUserId3],
});
export {
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
};

// Give Structure
// testUser1 : supersuperAdmin
// testUser2 : superAdmin of testBody
// testUser3 : admin of testBody
// testUser4 : a general user
// testBody : Has superAdmin as testUser2 and admin as testUser3
