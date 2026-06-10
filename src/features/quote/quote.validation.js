import { z } from 'zod';

export const createQuoteSchema = z.object({
  helpType: z.string().optional().nullable(),
  urgency:z.string().optional().nullable(),
  subject:z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required').max(20),
  message: z.string().optional().nullable(),
});

