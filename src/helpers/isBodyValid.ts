import { userApi } from '../types/types.js';

export const isBodyValid = (userData: userApi) => {
  return userData.username && userData.age && userData.hobbies ? true : false;
};
