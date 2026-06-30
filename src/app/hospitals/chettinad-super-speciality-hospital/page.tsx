"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck, Award, Users, Stethoscope, Heart, Brain, Bone, Baby, Microscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export default function ChettinadSuperSpecialityHospitalPage() {
  const hospitalImages = [
    {
      url: "/images/hospitals/chettinad/exterior.png",
      alt: "Chettinad Hospital Eco-friendly Support Campus"
    },
    {
      url: "/images/hospitals/chettinad/ot.png",
      alt: "Advanced Modular Operation Theatre"
    },
    {
      url: "/images/hospitals/chettinad/diagnostics.png",
      alt: "High-end Diagnostic Center"
    },
    {
      url: "/images/hospitals/chettinad/icu.png",
      alt: "Modern Intensive Care Unit"
    }
  ];

  const specialities = [
    {
      title: "Cardiology & Cardiothoracic Surgery",
      icon: Heart,
      description: "Specialised interventional cardiology and advanced heart surgeries including bypass and valve replacements."
    },
    {
      title: "Neurosciences",
      icon: Brain,
      description: "Comprehensive care for complex neurological disorders, stroke management, and neurosurgeries."
    },
    {
      title: "Orthopaedics & Sports Medicine",
      icon: Bone,
      description: "Expert joint replacements, trauma care, and arthroscopic procedures for sports injuries."
    },
    {
      title: "Cancer Institute",
      icon: Microscope,
      description: "Integrated oncology services providing surgical, medical, and radiation therapy under one roof."
    },
    {
      title: "Paediatrics & Neonatology",
      icon: Baby,
      description: "Advanced Level III NICU and PICU providing Specialised care for infants and children."
    },
    {
      title: "Gastroenterology",
      icon: Stethoscope,
      description: "Expert management of digestive tract diseases with advanced endoscopic procedures."
    }
  ];

  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Chettinad Super Speciality Hospital
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A 1570-bed quaternary care facility excellence in healthcare, education, and research within a 1.2 million sq. ft. eco-friendly campus.
          </p>
        </div>

        {/* Hero Carousel & About */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 lg:order-1">
            <Carousel className="w-full" plugins={[Autoplay({ delay: 3000 })]}>
              <CarouselContent>
                {hospitalImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold font-headline text-primary mb-6">
              World-Class Healthcare Destination
            </h2>
            <div className="space-y-4 text-foreground/70">
              <p>
                Chettinad Super Speciality Hospital, situated in the IT corridor of Chennai, is a premier healthcare institution known for its clinical excellence and patient-centric approach. With over 25 years of legacy, we combine experienced medical professionals with state-of-the-art technology.
              </p>
              <p>
                Our ISO 9001:2015 certified facility is designed to foster healing, featuring an eco-friendly campus that integrates healthcare, research, and education. We offer comprehensive medical services across a wide spectrum of specialities, ensuring that every patient receives Personalised and effective care.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-1">1570+</div>
                <div className="text-sm text-foreground/60">Beds</div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-foreground/60">Modular OTs</div>
              </div>
            </div>
          </div>
        </div>

        {/* centres of Excellence */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-4">
              centres of Excellence
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Delivering Specialised care with precision and compassion through our focused medical departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialities.map((specialty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <specialty.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">{specialty.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{specialty.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology & Infrastructure Features */}
        <div className="w-full bg-muted/30 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold font-headline text-center mb-12">
              Advanced Infrastructure & Technology
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="/images/hospitals/chettinad/diagnostics.png"
                    alt="Advanced Diagnostics"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Scan className="h-5 w-5 text-primary" />
                    Precision Diagnostics
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Equipped with 128-slice CT scanners, high-field MRI, and PET-CT for accurate and early disease detection. Our NABL-accredited labs ensure the highest standards of diagnostic reliability.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="/images/hospitals/chettinad/ot.png"
                    alt="Modern Operation Theatres"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Surgical Excellence
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    State-of-the-art modular operation theatres fitted with advanced surgical lights, microscopes, and anesthesia workstations to support complex and minimally invasive procedures.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="/images/hospitals/chettinad/icu.png"
                    alt="Critical Care"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Watch className="h-5 w-5 text-primary" />
                    Critical Care
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Comprehensive critical care capabilities with dedicated Medical, Surgical, Neonatal, and Paediatric ICUs, staffed 24/7 by intensivists and skilled nursing professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us / Values */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "NABH Accredited", desc: "Highest standards of safety and quality care." },
              { icon: Users, title: "Patient Centric", desc: "Treatment plans tailored to individual needs." },
              { icon: Award, title: "Expert Team", desc: "Highly skilled doctors and medical staff." },
              { icon: Lightbulb, title: "Innovation", desc: "Adopting the latest medical advancements." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 border rounded-xl bg-background shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/">
            <Button size="lg" className="bg-[#70529d] hover:bg-[#5b4282] px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
