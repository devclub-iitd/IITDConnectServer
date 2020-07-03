import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import User from '../src/models/user';
import * as bcrypt from 'bcryptjs';
import {Body} from '../src/models/body';

const testUserId = new mongoose.Types.ObjectId();
const testToken = jwt.sign(
  {id: testUserId},
  process.env.JWT_SECRET || 'thisismytestsecret'
);
const testUser = new User({
  _id: testUserId,
  name: 'testUser',
  email: 'testuser@gmail.com',
  password: bcrypt.hashSync('testuser', 10),
  superSuperAdmin: true,
});

const testBodyId = new mongoose.Types.ObjectId();

const testBody = new Body({
  _id: testBodyId,
  name: 'testBody',
  about: 'this is test body',
  caption: 'testing api-endpoints',
  typeOfBody: 1,
});
export {testUser, testToken, testUserId, testBody};
