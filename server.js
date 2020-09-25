//server.js

import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import env from './env';
import routes from './app/routes/routes'

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', routes)

app.listen(env.port).on('listening', () => {
  console.log(`🚀 are live on ${env.port}`);
});