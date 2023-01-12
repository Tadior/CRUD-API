import { cpus } from 'os';
import process from 'process';
import cluster from 'node:cluster';
import dotenv from 'dotenv';
import { USERS } from '../model/USERS';
// import { server } from '../main';
import { parentPort } from 'worker_threads';

dotenv.config();
const workers = [];
// const runCluster = async () => {
if (cluster.isPrimary) {
  const cpusCount = cpus().length;
  console.log(`Master pid: ${process.pid}`);
  console.log(`Starting ${cpusCount} forks`);

  for (let i = 0; i < cpusCount; i++) {
    const worker = cluster.fork({ port: Number(process.env.MAIN_PORT) + i });
    const id = worker.id;
    workers.push(worker);
    // worker.send!(USERS);
    worker.on('online', () => {
      worker.send(USERS);
      console.log('Yay, the worker responded after it was forked');
    });
    worker.on('message', (msg) => {
      console.log('message ' + msg);
    });
  }
}
cluster.on('online', (worker) => {
  // worker.send(USERS);
  worker.on('online', () => {
    worker.send(USERS);
    console.log('Yay, the worker responded after it was forked');
  });
  // console.log(worker);
});
if (cluster.isWorker) {
  // const id = cluster.worker?.id;
  require('../main');
  // process.on('online')
  cluster.on('message', (msg) => {
    console.log('------------------------------------------');
    console.log('DONE');
    console.log(msg);
  });
  // console.log(cluster.env.);
  // process.on()
  if (process.send) {
    process.send('dddvddv');
  }
}
// };
// parentPort?.on('message', (value) => {
//   console.log('MSG:', value);
// });

// runCluster();
