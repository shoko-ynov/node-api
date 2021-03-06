import mongoose from 'mongoose';
import express, { Application, json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import morganBody from 'morgan-body';

import RefreshTokenCron from './crons/refresh-token-cron';

const app: Application = express();
const { NODE_ENV } = process.env;

if (NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const { DB_URL, PORT } = process.env;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion,max-len
mongoose.connect(DB_URL!!, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    RefreshTokenCron.start();
  })
// eslint-disable-next-line no-console
  .catch((err: Error) => console.log(err));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const router = require('./router').default;

app.use(cors());
app.use(morgan(':method :url :status - :response-time ms - CONTENT-TYPE: :req[Content-Type] - ACCEPT: :req[Accept]'));
morganBody(app);
app.use(json());
app.use('/api', router());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started. PORT : ${PORT}`);
});
