import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import notFoundHandler from '../src/middlewares/notFoundHandler.js';
import errorHandler from '../src/middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());

  app.use(logger);

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
