import * as dotenv from 'dotenv';
import http from 'http';
import * as fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { USERS } from './model/USERS.js';
dotenv.config();

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  switch (request.url) {
    case '/api/users':
      try {
        response.statusCode = 200;
        return response.end(JSON.stringify(USERS));
      } catch (err) {
        throw err;
      }
    case '':
      break;
    default:
      response.statusCode = 404;
      return response.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(process.env.PORT, () => console.log('server started'));
