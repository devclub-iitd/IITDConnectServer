import app from './app';

import {cpus} from 'os';

const cluster = require('cluster');
const numCPUs = cpus().length;

if (process.env.NODE_ENV === 'production') {
  if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cluster.on('exit', (worker: {process: {pid: any}}) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app.listen(5000);
    console.log(`Worker ${process.pid} started`);
  }
} else {
  app.listen(5000, () => {
    console.log('Listening on Port 5000');
  });
}
