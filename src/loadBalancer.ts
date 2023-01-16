import { config } from 'dotenv';
import os from 'node:os';
import cluster, { Worker } from 'node:cluster';
import http from 'node:http';
import { userApi } from './types/types';
config();

const port = process.env.PORT || 4000;

export class LoadBalancer {
  workers: Worker[];
  wokerCounter: number;
  data: userApi[];
  cores: number;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  constructor() {
    this.cores = os.cpus().length;
    this.data = [];
    this.workers = [];
    this.wokerCounter = 0;
    this.server = this.createServer();
    this.createWorkers();
    this.off();
    this.listenWorkers();
  }

  listenServer(port: number, callback: () => void): void {
    this.server.listen(port, callback);
  }

  off(): void {
    process.on('SIGINT', () => {
      this.server.close();
      this.workers.forEach((worker) => worker.kill());
    });
  }

  listenWorkers(): void {
    this.workers.map((worker) => {
      worker.on('message', (data) => {
        this.workers.map((worker) => {
          worker.id !== this.wokerCounter && worker.send(data);
        });
      });
    });
  }

  createWorkers(): void {
    for (let i = 0; i < os.cpus().length; i++) {
      const worker = cluster.fork();
      this.workers.push(worker);
    }
  }

  checkWorker(): number {
    if (this.workers.length - 1 === this.wokerCounter) {
      this.wokerCounter = 0;
    } else {
      this.wokerCounter += 1;
    }

    return this.workers[this.wokerCounter].id;
  }

  createServer() {
    return http.createServer((req, res) => {
      let responseBody = '';
      req.on('data', (chunk) => {
        responseBody += chunk;
      });

      req.on('end', () => {
        const workerId = this.checkWorker();

        const request = http.request({
          host: 'localhost',
          port: Number(port) + workerId,
          path: req.url,
          method: req.method,
          headers: {
            balancer: 'true',
          },
        });

        request.on('error', () => {
          res.writeHead(500);
          res.end('Connection failed');
        });
        request.write(responseBody);
        request.end();

        request.on('response', (worker) => {
          let body = '';
          worker.on('data', (chunk) => {
            body += chunk;
          });
          worker.on('end', () => {
            res.statusCode = worker.statusCode!;
            res.end(body);
          });
        });
      });
    });
  }
}
