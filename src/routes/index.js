import { quoteRoutes } from '../features/quote/quote.route.js';
import { healthRoutes } from './health.route.js';

const BASE_PATH = '/api/v1';

export default (app) => {

  app.use(healthRoutes);
  app.use(`${BASE_PATH}/quotes`, quoteRoutes);
};