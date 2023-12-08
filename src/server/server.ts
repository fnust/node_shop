import { config } from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import dataSource from '../ormconfig';

config();

const init = async () => {
  const app: Express = express();

  const urlencodedParser = bodyParser.urlencoded({
    extended: true,
  });

  app.use(bodyParser.json());
  app.use(urlencodedParser);
  app.use('/api', router);

  const port = Number(process.env.SERVER_PORT);
  const host = String(process.env.SERVER_HOST);

  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });

  app.listen(port, host, function () {
    console.log(`⚡️ Server listens http://${host}:${port}`);
  });
};

export default init;
