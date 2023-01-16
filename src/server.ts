import http from 'http';
import EventEmitter from 'events';
import { HttpCode, METHOD, ResType, userApi } from './types/types';
import { UserService } from './user.service';

export class Server {
  data: userApi[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;
  userService: UserService;

  constructor() {
    this.data = [];
    this.emitter = new EventEmitter();
    this.server = this.createServer();
    this.userService = new UserService();
    this.setEndpoints();
    this.listenMaster();
  }

  setEndpoints() {
    this.emitter.on(this.getPath(METHOD.GET), this.userService.getUser.bind(this));
    this.emitter.on(this.getPath(METHOD.POST), this.userService.createUser.bind(this));
    this.emitter.on(this.getPath(METHOD.PUT), this.userService.updateUser.bind(this));
    this.emitter.on(this.getPath(METHOD.DELETE), this.userService.removeUser.bind(this));
  }

  sendDB(data: userApi[]) {
    process.send && process.send(data);
  }

  listenMaster() {
    process.on('message', (data) => {
      this.data = data as userApi[];
    });
  }

  listen(port: string | number, cb: () => void) {
    this.server.listen(port);
    cb();
  }

  getPath(method: string, root = 'api', path = 'users'): string {
    return `${root}/${path}:${method}`;
  }

  createServer() {
    return http.createServer((req, res) => {
      try {
        (res as ResType).send = (code: HttpCode, data: any) => {
          res.writeHead(code);
          res.end(JSON.stringify(data));
        };

        const [root = '', path = '', parameter, error] = req.url!.split('/').slice(1);
        if (error) {
          res.writeHead(HttpCode.NotFound);
          res.end(JSON.stringify(`this url does not exist`));
        } else {
          const emit = this.emitter.emit(
            this.getPath(req.method!, root, path),
            req,
            res,
            parameter,
            this.data,
            this.sendDB
          );

          if (!emit) {
            res.writeHead(HttpCode.NotFound);
            res.end(JSON.stringify(`this url does not exist`));
          }
        }
      } catch (e) {
        console.log(Error);
      }
    });
  }
}
