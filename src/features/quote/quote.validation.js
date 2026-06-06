import { z } from 'zod';

export const createQuoteSchema = z.object({
  helpType: z.enum([
    'DO_MY_ONLINE_CLASS',
    'TAKE_MY_PROCTORED_EXAM',
    'RESEARCH_PAPER',
    'TAKE_MY_ONLINE_TEST',
    'ACADEMIC_ESSAY',
    'CLASS_PROJECT',
    'OTHER'
  ], {
    required_error: 'Help type is required',
  }),
  
  urgency: z.enum([
    'TODAY',
    '24_HOURS',
    '2_3_DAYS',
    'THIS_WEEK',
    'FLEXIBLE_ACADEMY'
  ], {
    required_error: 'Urgency is required',
  }),
  
  subject: z.string().min(1, 'Subject/Course is required').max(500),
  
  name: z.string().min(2, 'Name is required').max(100),
  
  email: z.string().email('Valid email is required'),
  
  phoneNumber: z.string().min(10, 'Valid phone number is required').max(20),
  
  message: z.string().min(10, 'Message/Project details must be at least 10 characters').max(5000),
});

