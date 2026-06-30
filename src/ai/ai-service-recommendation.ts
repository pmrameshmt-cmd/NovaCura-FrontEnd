'use server';

/**
 * @fileOverview AI-powered service recommendation flow.
 *
 * This file defines a Genkit flow that provides Personalised medical service
 * recommendations based on user needs and preferences.
 *
 * @module src/ai/ai-service-recommendation
 *
 * @exported
 * - `recommendServices`:  A function to trigger the AI-powered service recommendation flow.
 * - `ServiceRecommendationInput`: The input type for the recommendServices function.
 * - `ServiceRecommendationOutput`: The output type for the recommendServices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const ServiceRecommendationInputSchema = z.object({
  needs: z.string().describe('The user\u2019s medical needs and preferences.'),
  budget: z.string().optional().describe('The user\u2019s budget range, if any.'),
  locationPreference: z.string().optional().describe('The user\u2019s preferred location for the service.'),
});

export type ServiceRecommendationInput = z.infer<typeof ServiceRecommendationInputSchema>;

// Define the output schema
const ServiceRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      serviceName: z.string().describe('The name of the recommended medical service.'),
      description: z.string().describe('A brief description of the service and why it fits the user\u2019s needs.'),
      estimatedCost: z.string().optional().describe('The estimated cost of the service.'),
    })
  ).describe('A list of Personalised medical service recommendations.'),
});

export type ServiceRecommendationOutput = z.infer<typeof ServiceRecommendationOutputSchema>;


// Define the prompt
const serviceRecommendationPrompt = ai.definePrompt({
  name: 'serviceRecommendationPrompt',
  input: {schema: ServiceRecommendationInputSchema},
  output: {schema: ServiceRecommendationOutputSchema},
  prompt: `Based on the user's medical needs and preferences, provide a list of Personalised medical service recommendations.

  Needs: {{{needs}}}
  Budget: {{{budget}}}
  Location Preference: {{{locationPreference}}}

  Format the output as a JSON object with a \"recommendations\" field.  Each entry in the \"recommendations\" array should have a \"serviceName\", \"description\", and \"estimatedCost\" (if known) field.
  `,
});

// Define the flow
const serviceRecommendationFlow = ai.defineFlow(
  {
    name: 'serviceRecommendationFlow',
    inputSchema: ServiceRecommendationInputSchema,
    outputSchema: ServiceRecommendationOutputSchema,
  },
  async input => {
    const {output} = await serviceRecommendationPrompt(input);
    return output!;
  }
);

/**
 * Recommends services based on user input.
 * @param input The user input containing needs, budget, and location preference.
 * @returns A promise that resolves to a ServiceRecommendationOutput object.
 */
export async function recommendServices(input: ServiceRecommendationInput): Promise<ServiceRecommendationOutput> {
  return serviceRecommendationFlow(input);
}
