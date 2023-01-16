import { Server } from '../server';
import axios from 'axios';
import { validate as uuidValidate } from 'uuid';

const baseUrl = 'http://localhost:4000';

describe('Server Crud', function () {
  const app = new Server();
  app.server.listen(4000);
  const userDataMock = jest.fn();

  beforeAll((done) => {
    done();
  });
  afterAll((done) => {
    app.server.close();
    done();
  });

  test('GET / get all users', async () => {
    const request = await axios.get(baseUrl + '/api/users');
    expect(request.status).toEqual(200);
    expect(request.data).toEqual([]);
  });

  test('POST / create user', async () => {
    const body = { username: 'Tadior', age: 24, hobbies: ['it', 'workout'] };
    const request = await axios.post(baseUrl + '/api/users', body);
    userDataMock.mockReturnValue(request.data);
    expect(request.status).toEqual(201);
    expect(uuidValidate(request.data.id)).toEqual(true);
    expect(request.data.username).toEqual('Tadior');
    expect(request.data.age).toEqual(24);
    expect(request.data.hobbies).toEqual(['it', 'workout']);
  });

  test('GET / get user id', async () => {
    const userData = userDataMock();
    const request = await axios.get(baseUrl + `/api/users/${userData.id}`);
    expect(request.data).toEqual(userData);
  });

  test('PUT / update user', async () => {
    const userData = userDataMock();
    const updatedBody = { username: 'Lord', age: 35, hobbies: ['boxing', 'painting'] };
    const request = await axios.put(`${baseUrl}/api/users/${userData.id}`, updatedBody);
    expect(request.data).toEqual({ id: userData.id, ...updatedBody });
  });

  test('DELETE / remove user', async () => {
    const userData = userDataMock();
    const request = await axios.delete(`${baseUrl}/api/users/${userData.id}`);
    expect(request.status).toEqual(204);
  });
});
