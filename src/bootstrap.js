import { Application } from './app.js';
import { config } from './config/config.js';
import { connectDatabase } from './config/db.js';

const startApplication = async () => {
  const application = new Application();

  try {
    await connectDatabase();
    config.logger.info('Database connected');

    application.start();
    config.logger.info('Application started successfully');
  } catch (error) {
    config.logger.error('Startup failed', error, 'Bootstrap');
    process.exit(1);
  }
};

startApplication().catch((error) => {
  config.logger.error('Unhandled bootstrap error', error, 'Bootstrap');
  process.exit(1);
});