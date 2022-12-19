import { USERS } from '../model/USERS.js';

export const findUser = (id: string) => {
  return USERS.find((user) => user.id === id);
};
