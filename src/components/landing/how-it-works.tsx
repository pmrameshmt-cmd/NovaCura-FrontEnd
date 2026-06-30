import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, DraftingCompass, PlaneTakeoff, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: DraftingCompass,
    title: '1. Initial Consultation',
    description: 'A confidential consultation to understand your unique medical needs, preferences, and long-term health goals.',
  },
  {
    icon: Briefcase,
    title: '2. Curated Plan',
    description: 'We design a bespoke health plan, selecting from our exclusive network of world-leading specialists and institutions.',
  },
  {
    icon: PlaneTakeoff,
    title: '3. Seamless Execution',
    description: 'Every detail is flawlessly managed, from private travel and luxury accommodations to all medical appointments and transfers.',
  },
  {
    icon: ShieldCheck,
    title: '4. Continued Care',
    description: 'We provide comprehensive post-treatment support and ongoing wellness management to ensure your sustained health.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            A Journey to Unparalleled Wellness
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Our process is designed for ultimate convenience, privacy, and effectiveness, ensuring a seamless experience from start to finish.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title} className="text-center border-t-4 border-primary pt-6 transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
