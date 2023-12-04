import { config } from 'dotenv';
import express from 'express';
import router from './routes.js';
import bodyParser from 'body-parser';

config();

const init = async () => {
  const app = express();

  const urlencodedParser = bodyParser.urlencoded({
    extended: true,
  });

  app.use(bodyParser.json());
  app.use(urlencodedParser);
  app.use('/api', router);

  const port = process.env.SERVER_PORT;
  const host = process.env.SERVER_HOST;

  app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
  });
};

export default init;
