
import { ayurvedicHospitals } from '@/lib/ayurvedic-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function AyurvedicHospitals() {
  return (
    <section id="ayurvedic-hospitals" className="py-24 sm:py-32 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            Ayurvedic Hospitals
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Discover the healing power of Ayurveda and holistic wellness through our world-renowned partner institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {ayurvedicHospitals.map((hospital) => (
            <Link href={`/hospitals/ayurvedic/${hospital.id}`} key={hospital.id}>
              <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full cursor-pointer bg-white/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-2xl text-primary">
                    {hospital.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{hospital.shortSummary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
