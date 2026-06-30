"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck, Heart, Stethoscope, Leaf, Award, UserCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export default function MgmHospitalPage() {
  const hospitalImages = [
    { imageUrl: "/images/hospitals/mgm/exterior.png", alt: "MGM Healthcare Exterior - LEED Platinum Green Building" },
    { imageUrl: "/images/hospitals/mgm/reception.png", alt: "MGM Healthcare Lobby with Vertical Garden" },
    { imageUrl: "/images/hospitals/mgm/room.png", alt: "Premium Patient Room" },
  ];

  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            MGM Healthcare
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Redefining Healthcare with "Healthcaring"
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Carousel className="w-full max-w-xl mx-auto" plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}>
              <CarouselContent>
                {hospitalImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={image.imageUrl}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
            </Carousel>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full mt-1">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">LEED Platinum Certified</h3>
                <p className="text-muted-foreground">
                  India's first USGBC LEED Platinum-certified green hospital, featuring the city's tallest vertical garden and an eco-friendly healing environment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full mt-1">
                <Hospital className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">World-Class Infrastructure</h3>
                <p className="text-muted-foreground">
                  A 400-bed super-speciality facility with 100 critical care beds, 55 outpatient consultation rooms, and 12 state-of-the-art operation theatres.
                </p>
              </div>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed pt-4">
              MGM Healthcare is dedicated to providing outstanding patient experiences through world-class expertise and advanced medical technologies. We believe that healing extends beyond medical treatment, combining clinical excellence with genuine compassion.
            </p>
          </div>
        </div>

        {/* centres of Excellence */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-4">
              centres of Excellence
            </h2>
            <p className="text-foreground/70 text-lg">
              Delivering Specialised care across a wide spectrum of medical disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Cardiac Sciences", desc: "Leader in Heart & Lung Transplants and ECMO care." },
              { icon: Leaf, title: "Liver Diseases & Transplant", desc: "Comprehensive care for liver, pancreas, and biliary diseases." },
              { icon: Activity, title: "Neurosciences", desc: "Advanced neurosurgery and spine surgery capabilities." },
              { icon: UserCheck, title: "Women & Child Health", desc: "Dedicated obstetrics, gynaecology, and paediatrics wings." },
              { icon: Stethoscope, title: "Gastro Sciences", desc: "Expertise in minimal access GI and bariatric surgeries." },
              { icon: ShieldCheck, title: "Renal Sciences", desc: "State-of-the-art kidney transplant and dialysis units." }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-2">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mt-24 bg-slate-50 rounded-3xl p-8 sm:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Scan className="w-64 h-64" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">Pioneering Medical Technology</h2>
              <ul className="space-y-4">
                {[
                  "Biplane Cath Lab for complex cardiac procedures",
                  "Advanced 3 Tesla MRI for precise imaging",
                  "Voice-enabled nurse assistants in patient rooms",
                  "IoT-enabled Critical Care Units",
                  "Advanced ECMO and VAD (Ventricular Assist Device) support"
                ].map((tech, i) => (
                  <li key={i} className="flex gap-3 items-center text-lg text-muted-foreground">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Pin className="h-4 w-4 text-primary" />
                    </div>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl ring-4 ring-white">
              {/* Using the room image as a proxy for tech/modern interior if specific tech image absent */}
              <Image
                src="/images/hospitals/mgm/room.png"
                alt="Advanced Medical Facilities"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-6">Experience World-Class Care</h2>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
