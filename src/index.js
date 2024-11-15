import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';
import 'dotenv/config';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();
