'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getRecommendationAction, type RecommendationState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';

const initialState: RecommendationState = {
  message: '',
  recommendation: null,
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Get Recommendation
        </>
      )}
    </Button>
  );
}

export default function AiRecommender() {
  const [state, formAction] = useFormState(getRecommendationAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if(!state.error && state.recommendation) {
        formRef.current?.reset();
    }
  }, [state]);

  return (
    <section id="ai-concierge" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
              Your Personal AI Concierge
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Leverage our advanced AI to receive instant, Personalised service recommendations. Simply describe your needs, and let our digital concierge craft a preliminary plan for your consideration.
            </p>
          </div>
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Discover Your Ideal Care Plan</CardTitle>
              <CardDescription>
                Provide a few details to get started.
              </CardDescription>
            </CardHeader>
            <form action={formAction} ref={formRef}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concern">Primary Concern</Label>
                  <Input id="concern" name="concern" required placeholder="e.g., Preventative Cardiology, Orthopedic Surgery" />
                  {state.fieldErrors?.concern && <p className="text-sm text-destructive">{state.fieldErrors.concern[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferences">Travel &amp; Luxury Preferences (Optional)</Label>
                  <Textarea id="preferences" name="preferences" placeholder="e.g., Private jet travel, 5-star suite with ocean view" />
                  {state.fieldErrors?.preferences && <p className="text-sm text-destructive">{state.fieldErrors.preferences[0]}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <SubmitButton />
              </CardFooter>
            </form>
            {state.recommendation && !state.error && (
              <div className="p-6 border-t">
                  <h3 className="font-bold text-primary">Personalised Recommendation</h3>
                  <p className="mt-2 text-foreground/80 animate-fade-in-up">{state.recommendation}</p>
              </div>
            )}
            {state.message && state.error && (
                <div className="p-6 border-t">
                    <p className="text-destructive">{state.message}</p>
                </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
