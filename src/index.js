import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  try {
    await initMongoDB();
    setupServer();
  } catch {
    (error) => console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

bootstrap();
