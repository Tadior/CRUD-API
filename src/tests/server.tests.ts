import { Server } from '../server';
import axios from 'axios';
import { validate as uuidValidate } from 'uuid';

// describe('Server tests', () => {
//   const userDataMock = jest.fn();
//   beforeAll((done) => {
//     done();
//   });
//   afterAll((done) => {
//     server.close();
//     done();
//   });
//   test("Get all user's records", async () => {
//     const request = await axios.get('http://localhost:3000/api/users');
//     expect(request.status).toEqual(200);
//     expect(request.data).toEqual([]);
//   });
//   test('Create new user', async () => {
//     const body = { username: 'Tadior', age: 24, hobbies: ['it', 'workout'] };
//     const request = await axios.post('http://localhost:3000/api/users', body);
//     userDataMock.mockReturnValue(request.data);
//     expect(uuidValidate(request.data.id)).toEqual(true);
//     expect(request.data.username).toEqual('Tadior');
//     expect(request.data.age).toEqual(24);
//     expect(request.data.hobbies).toEqual(['it', 'workout']);
//   });
//   test('Get created user', async () => {
//     const userData = userDataMock();
//     const request = await axios.get(`http://localhost:3000/api/users/${userData.id}`);
//     expect(request.data).toEqual(userData);
//   });
//   test('Update created user', async () => {
//     const userData = userDataMock();
//     const updatedBody = { username: 'Lord', age: 35, hobbies: ['boxing', 'painting'] };
//     const request = await axios.put(`http://localhost:3000/api/users/${userData.id}`, updatedBody);
//     expect(request.data).toEqual({ id: userData.id, ...updatedBody });
//   });
//   test('Delete created user', async () => {
//     const userData = userDataMock();
//     const request = await axios.delete(`http://localhost:3000/api/users/${userData.id}`);
//     expect(request.data).toEqual({ message: 'User was deleted' });
//   });
//   test('Check deleted user', async () => {
//     const userData = userDataMock();
//     const request = await axios.get(`http://localhost:3000/api/users/${userData.id}`);
//     expect(request.data).toEqual({ error: 'User with such id is not found' });
//   });
// });
