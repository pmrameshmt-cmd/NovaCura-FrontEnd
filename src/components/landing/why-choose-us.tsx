import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const benefits = [
  'Access to a curated network of the world’s top 1% of medical experts.',
  'Absolute discretion and confidentiality in all matters.',
  'Fully bespoke healthcare journeys tailored to your individual needs.',
  '24/7 dedicated support from your personal health concierge.',
  'Seamless integration of luxury travel, accommodation, and medical care.',
];

export default function WhyChooseUs() {
    const whyChooseUsImage = PlaceHolderImages.find(p => p.id === 'why-choose-us');

  return (
    <section id="why-choose-us" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
              The NOVACURA GLOBAL Standard of Care
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Choosing NOVACURA GLOBAL means opting for a standard of healthcare that transcends the ordinary. We are defined by our commitment to excellence, privacy, and personalisation.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-96 w-full rounded-2xl shadow-2xl overflow-hidden lg:h-[500px]">
            {whyChooseUsImage && (
                <Image
                src={whyChooseUsImage.imageUrl}
                alt={whyChooseUsImage.description}
                fill
                className="object-cover"
                data-ai-hint={whyChooseUsImage.imageHint}
                />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
