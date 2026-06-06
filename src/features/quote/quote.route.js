import express from 'express';
import { quoteController } from './quote.controller.js';

const router = express.Router();


router.post('/', quoteController.createQuote);
export const quoteRoutes = router;