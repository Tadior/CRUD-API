import { USERS } from '../model/USERS';

export const findUser = (id: string) => {
  return USERS.find((user) => user.id === id);
};
