import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use(
    '/contacts',
    (req, res, next) => {
      console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
      next();
    },
    contactsRouter,
  );

  app.use((req, res) => {
    console.log(`404 Not Found for: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Not Found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
