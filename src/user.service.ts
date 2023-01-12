import { v4, validate } from 'uuid';
import { checkCreated, checkUpdated } from './helpers/checkData';
import { ErrorMessage } from './error.service';
import { userApi, HttpCode, ReqType, ResType } from './types/types';

export class UserService {
  getUser(req: ReqType, res: ResType, parameter: string, data: userApi[]) {
    try {
      if (!parameter) {
        res.send(HttpCode.Success, data);
        return;
      }
      const [user] = data.filter((user) => user.id === parameter);
      if (validate(parameter)) {
        user ? res.send(HttpCode.Success, user) : res.send(HttpCode.NotFound, ErrorMessage.notUserId(parameter));
      } else {
        res.send(HttpCode.BadReq, ErrorMessage.notValidId(parameter));
      }
    } catch (e) {
      console.log('Error');
    }
  }

  createUser(req: ReqType, res: ResType, parameter: string, data: userApi[], send: (data: userApi[]) => void) {
    if (parameter) {
      res.send(HttpCode.NotFound, ErrorMessage.notFound);
      return;
    } else {
      let responseBody = '';
      req.on('data', (chunk) => {
        responseBody += chunk;
      });

      req.on('end', () => {
        try {
          const user = JSON.parse(responseBody);
          const errors = checkCreated(user);

          if (errors.length === 0) {
            const id = v4();
            data.push({ id, username: user.username, age: user.age, hobbies: user.hobbies });
            send(data);
            res.send(HttpCode.Created, { id, ...user });
          } else {
            res.send(HttpCode.BadReq, { errors });
          }
        } catch (e) {
          res.send(HttpCode.BadReq, ErrorMessage.failed('create'));
        }
      });
    }
  }

  updateUser(req: ReqType, res: ResType, parameter: string, data: userApi[], send: (data: userApi[]) => void) {
    const index = data.findIndex((el) => el.id === parameter);
    if (!parameter) {
      res.send(HttpCode.NotFound, ErrorMessage.notID);
      return;
    }
    if (!validate(parameter)) {
      res.send(HttpCode.BadReq, ErrorMessage.notValidId(parameter));
      return;
    }
    if (index === -1) {
      res.send(HttpCode.NotFound, ErrorMessage.notUserId(parameter));
      return;
    }
    let responseBody = '';
    req.on('data', (chunk) => {
      responseBody += chunk;
    });
    req.on('end', () => {
      try {
        const user = JSON.parse(responseBody);
        const errors = checkUpdated(user);

        if (errors.length === 0) {
          const prevItem = data[index];
          const userItem = {
            id: prevItem.id,
            username: user.username ? user.username : prevItem.username,
            age: user.age ? user.age : prevItem.age,
            hobbies: user.hobbies ? user.hobbies : prevItem.hobbies,
          };

          data.splice(index, 1, userItem);
          send(data);
          res.send(HttpCode.Success, userItem);
        } else {
          res.send(HttpCode.BadReq, { errors });
        }
      } catch (e) {
        res.send(HttpCode.BadReq, ErrorMessage.failed('update'));
      }
    });
  }

  removeUser(req: ReqType, res: ResType, parameter: string, data: userApi[], send: (data: userApi[]) => void) {
    try {
      const userId = data.findIndex((el) => el.id === parameter);
      if (!parameter) {
        res.send(HttpCode.BadReq, ErrorMessage.notID);
        return;
      }
      if (!validate(parameter)) {
        res.send(HttpCode.NotFound, ErrorMessage.notValidId(parameter));
        return;
      }
      if (userId === -1) {
        res.send(HttpCode.BadReq, ErrorMessage.notUserId(parameter));
        return;
      }

      data.splice(userId, 1);
      send(data);
      res.send(HttpCode.Delete, null);
    } catch (e) {
      console.log('Error');
    }
  }
}
