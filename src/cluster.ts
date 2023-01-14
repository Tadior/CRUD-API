import { config } from 'dotenv';
import { Server } from './server';
import cluster from 'node:cluster';
import { LoadBalancer } from './loadBalancer';

const port = process.env.PORT || 4000;

if (cluster.isPrimary) {
  const balancer = new LoadBalancer();

  balancer.listenServer(+port, () => {
    console.log(`Balancer: ${port}`);
  });
} else {
  const worker = new Server();

  worker.listen(+port + cluster.worker!.id, () => {
    console.log(`Listen Port: ${+port + cluster.worker!.id}`);
  });
}
