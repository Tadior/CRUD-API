import * as dotenv from 'dotenv';
import http from 'http';
import { v4 as uuidV4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { USERS } from './model/USERS.js';
import { userApi } from './types/types.js';
import { findUser } from './helpers/findUser.js';
import { isBodyValid } from './helpers/isBodyValid.js';

dotenv.config();

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(request.url);
  if (!request.url) {
    return false;
  }
  console.log(request.method);
  if (request.url.match(/^\/api\/users$|^\/api\/users\/$/) && request.method === 'GET') {
    try {
      response.statusCode = 200;
      return response.end(JSON.stringify(USERS));
    } catch (err) {
      throw err;
    }
  } else if (request.url.match(/\/api\/users\/[\w]+/i) && request.method === 'GET') {
    const userId = request.url.replace('/api/users/', '');
    if (!uuidValidate(userId)) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: 'Invalid id' }));
    }
    const user = findUser(userId);
    if (user) {
      response.statusCode = 200;
      return response.end(JSON.stringify(user));
    } else {
      response.statusCode = 404;
      return response.end(JSON.stringify({ error: 'User with such id is not found' }));
    }
  } else if (request.url.match(/^\/api\/users$|^\/api\/users\/$/) && request.method === 'POST') {
    const body: Buffer[] = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    request.on('end', () => {
      const bodyFull = JSON.parse(Buffer.concat(body).toString());
      if (isBodyValid(bodyFull)) {
        const newUser: userApi = {
          id: uuidV4(),
          username: bodyFull.username,
          age: bodyFull.age,
          hobbies: bodyFull.hobbies,
        };
        USERS.push(newUser);
        response.statusCode = 201;
        return response.end(JSON.stringify(newUser));
      } else {
        response.statusCode = 400;
        return response.end(JSON.stringify({ error: 'Body does not contain required fields' }));
      }
    });
  } else if (request.url.match(/\/api\/users\/[\w]+/i) && request.method === 'PUT') {
    const userId = request.url.replace('/api/users/', '');
    const userData = findUser(userId);
    if (!uuidValidate(userId) || !userData) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: "User with such id is't found" }));
    }
    const body: Buffer[] = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    request.on('end', () => {
      const bodyFull: userApi = JSON.parse(Buffer.concat(body).toString());
      if (isBodyValid(bodyFull)) {
        const userIndex = USERS.findIndex((user) => user === userData);
        if (userIndex !== -1) {
          USERS[userIndex] = { id: USERS[userIndex].id, ...bodyFull };
          response.statusCode = 200;
          return response.end(JSON.stringify({ message: 'User was updated' }));
        } else {
          response.statusCode = 404;
          response.end(JSON.stringify({ error: "User with such id is't found" }));
        }
      } else {
        response.statusCode = 400;
        return response.end(JSON.stringify({ error: 'Body does not contain required fields' }));
      }
    });
  } else if (request.url.match(/\/api\/users\/[\w]+/i) && request.method === 'DELETE') {
    const userId = request.url.replace('/api/users/', '');
    const userData = findUser(userId);
    if (!uuidValidate) {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: 'Incorrect id' }));
    } else if (!userData) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: "User with such id is't found" }));
    } else {
      const userIndex = USERS.findIndex((user) => user === userData);
      USERS.splice(userIndex, 1);
      response.statusCode = 204;
      response.end(JSON.stringify({ message: 'User was deleted' }));
    }
  } else {
    response.statusCode = 404;
    return response.end(JSON.stringify({ error: "Route was't found" }));
  }
});

server.listen(process.env.PORT, () => console.log('server started'));
