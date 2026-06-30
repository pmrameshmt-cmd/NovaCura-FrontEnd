
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital } from 'lucide-react';
import Link from 'next/link';

const hospitalRegions = [
  {
    country: "India",
    hospitals: [
      {
        icon: Hospital,
        title: 'SRM Global Hospitals',
        description: 'A leading multi-speciality hospital, offering a wide range of medical services.',
        pagePath: '/hospitals/srm-global-hospitals',
      },
      {
        icon: Hospital,
        title: 'Apollo Hospitals',
        description: 'A large, private hospital chain with a strong presence in India.',
        pagePath: '/hospitals/apollo-hospitals',
      },
      {
        icon: Hospital,
        title: 'Kauvery Hospital',
        description: 'A multi-speciality hospital chain in South India, known for its patient-centric approach.',
        pagePath: '/hospitals/kauvery-hospital',
      },
      {
        icon: Hospital,
        title: 'Chettinad Super Speciality Hospital',
        description: 'A well-known super speciality hospital providing advanced healthcare.',
        pagePath: '/hospitals/chettinad-super-speciality-hospital',
      },
      {
        icon: Hospital,
        title: 'MGM Hospital',
        description: 'A modern, multi-speciality hospital committed to providing quality healthcare.',
        pagePath: '/hospitals/mgm-hospital',
      },
    ]
  },
  {
    country: "Turkey",
    hospitals: [
      {
        icon: Hospital,
        title: 'Medical Park',
        description: 'A leading healthcare group providing international standards of medical excellence.',
        pagePath: '/hospitals/medical-park',
      },
    ]
  },
  {
    country: "Bulgaria",
    hospitals: [
      {
        icon: Hospital,
        title: 'Dr. Saeed Alzahr Dental Clinic',
        description: 'A state-of-the-art dental facility in Varna, Bulgaria, offering professional and Personalised care.',
        pagePath: '/hospitals/dr-alzahr-dental-clinic',
      },
    ]
  }
];

export default function Hospitals() {
  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Partnered Hospitals
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            We have established strong partnerships with the world's leading medical institutions to ensure you receive the best possible care.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {hospitalRegions.map((region) => (
            <div key={region.country}>
              <h3 className="text-2xl font-bold mb-8 text-primary border-b pb-2 inline-block">
                {region.country}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {region.hospitals.map((hospital) => (
                  <Link href={hospital.pagePath} key={hospital.title}>
                    <Card className="text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl h-full">
                      <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <hospital.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="mt-4 font-headline text-2xl">
                          {hospital.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">{hospital.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
