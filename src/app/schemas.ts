import { z } from 'zod';

export const RecommendationRequestSchema = z.object({
  concern: z.string().min(1, { message: 'Primary concern is required.' }),
  preferences: z.string().optional(),
});
