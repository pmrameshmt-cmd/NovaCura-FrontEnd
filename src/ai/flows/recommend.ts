'use server';

import { ai } from '@/ai/genkit';
import { RecommendationRequestSchema } from '@/app/schemas';
import { z } from 'zod';


export const recommendFlow = ai.defineFlow(
  {
    name: 'recommendFlow',
    inputSchema: RecommendationRequestSchema,
    outputSchema: z.string(),
  },
  async ({ concern, preferences }) => {
    // For this implementation, we will return a hardcoded response
    // to simulate the AI functionality.

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    let recommendationText = `Based on your interest in '${concern}', we recommend our premier 'Executive Wellness & Rejuvenation' package. This comprehensive program includes advanced diagnostic screenings, Personalised nutrition and fitness planning with leading experts, and a suite of preventative therapies. `;

    if (preferences && preferences.toLowerCase().includes('private')) {
        recommendationText += `To align with your preference for '${preferences}', we will arrange for private, first-class air travel and a secluded luxury suite with dedicated 24/7 medical staff. Every detail will be managed to ensure your utmost comfort and privacy.`;
    } else if (preferences) {
        recommendationText += `Regarding your preference for '${preferences}', we will ensure your travel and accommodation arrangements are of the highest standard, prioritizing your comfort and a seamless experience.`;
    } else {
        recommendationText += `We can also arrange for world-class travel and accommodation to match your needs for a seamless and stress-free experience.`;
    }

    return recommendationText;
  }
);
