import * as fs from 'node:fs';
import express from 'express';
import path from 'node:path';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import notFoundHandler from '../src/middlewares/notFoundHandler.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/auth.js';
import swaggerUI from 'swagger-ui-express';

export const setupServer = () => {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
  );

  const app = express();

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  const logger = pino();

  app.use('/photos', express.static(path.resolve('src/public/photos')));

  app.use(cors());
  app.use(cookieParser());

  app.use(logger);

  app.use('/contacts', auth, contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
