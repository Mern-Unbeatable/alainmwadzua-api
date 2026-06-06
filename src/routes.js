
import { quoteRoutes } from '@feature/quote/quote.routes';

const BASE_PATH = '/api/v1';

export default (app) => {
  const routes = () => {
    app.use(BASE_PATH, quoteRoutesy.routes());
  };

  routes();
};
