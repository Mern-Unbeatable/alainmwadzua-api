import { Logger } from '../../config/logger.js';
import { catchAsync } from '../../shared/globals/decorators/catch-async.js';
import { ResponseHandler } from '../../shared/globals/helpers/response.handler.js';
import { quoteService } from './quote.service.js';
import { createQuoteSchema } from './quote.validation.js';
import { BadRequestError } from '../../shared/globals/helpers/error-handler.js';

class QuoteController {
  constructor() {
    this.log = new Logger('QuoteController');
  }

  createQuote = catchAsync(async (req, res) => {
    this.log.info('Creating new quote request');
    
    const data = createQuoteSchema.parse(req.body);
    
    const quote = await quoteService.createQuote(data);
    
    ResponseHandler.created(res, {
      message: 'Quote request submitted successfully! We will contact you soon.',
      data: {
        id: quote.id,
        createdAt: quote.createdAt,
      },
    });
  });
}

export const quoteController = new QuoteController();