'use server';

import { run } from 'genkit';
import { recommendFlow } from '@/ai/flows/recommend';
import { RecommendationRequestSchema } from '@/app/schemas';

export type RecommendationState = {
  message: string;
  recommendation: string | null;
  error: boolean;
  fieldErrors?: {
    concern?: string[];
    preferences?: string[];
  }
}

export async function getRecommendationAction(prevState: RecommendationState, formData: FormData): Promise<RecommendationState> {
  const validatedFields = RecommendationRequestSchema.safeParse({
    concern: formData.get('concern'),
    preferences: formData.get('preferences'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input. Please check your entries.',
      recommendation: null,
      error: true,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const recommendation = await run(recommendFlow, validatedFields.data);
    return {
      message: 'Here is your Personalised recommendation:',
      recommendation,
      error: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'We encountered an issue generating your recommendation. Please try again later.',
      recommendation: null,
      error: true,
    };
  }
}
