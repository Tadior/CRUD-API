import { config } from 'dotenv';
import { Server } from './server';
config();

const port = process.env.PORT || 4000;

const server = new Server();

server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
