import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Plane, Building2, HeartPulse, Brain, Bone } from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Elite Medical Network',
    description: 'Access to world-renowned specialists and leading medical institutions globally.',
  },
  {
    icon: Plane,
    title: 'Private Medical Travel',
    description: 'Seamless and confidential travel arrangements, including private jets and medical escorts.',
  },
  {
    icon: Building2,
    title: 'Luxury Accommodations',
    description: 'Arrangement of 5-star hotel suites and private residences for your comfort and recovery.',
  },
  {
    icon: HeartPulse,
    title: 'Preventative Care',
    description: 'Comprehensive health screenings and Personalised wellness programs for long-term vitality.',
  },
  {
    icon: Brain,
    title: 'Specialised Treatments',
    description: 'Coordinated access to cutting-edge treatments and niche medical expertise.',
  },
  {
    icon: Bone,
    title: 'Post-Operative Care',
    description: 'Dedicated 24/7 nursing and therapeutic support in the privacy of your chosen location.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            Our Bespoke Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            We meticulously tailor every aspect of your healthcare journey to meet your unique needs with unparalleled precision and care.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
