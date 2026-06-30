"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

// Import Kauvery Hospital images
// TODO: Add actual images to src/assets/images/Kauvery/ directory
// import kauveryImage1 from '@/assets/images/Kauvery/kauvery-1.png';
// import kauveryImage2 from '@/assets/images/Kauvery/kauvery-2.png';
// import kauveryImage3 from '@/assets/images/Kauvery/kauvery-3.png';
// import kauveryImage4 from '@/assets/images/Kauvery/kauvery-4.png';
// import kauveryImage5 from '@/assets/images/Kauvery/kauvery-5.png';

// Temporary: Using placeholder until real images are added
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function KauveryHospitalPage() {
  // TODO: Replace with actual images once added
  // const hospitalImages = [
  //   { src: kauveryImage1, alt: 'Kauvery Hospital Exterior' },
  //   { src: kauveryImage2, alt: 'Advanced Medical Technology at Kauvery' },
  //   { src: kauveryImage3, alt: 'Patient Care Facilities' },
  //   { src: kauveryImage4, alt: 'Advanced Surgical Facilities' },
  //   { src: kauveryImage5, alt: 'Kauvery Hospital Facilities' },
  // ];

  // Temporary placeholder images
  // Temporary placeholder images
  const hospitalImages = PlaceHolderImages.filter(img =>
    img.imageHint.includes('hospital') || img.imageHint.includes('doctor')
  ).slice(0, 5);

  // Ensure we have at least 5 images for all slots by cycling if needed
  if (hospitalImages.length > 0) {
    while (hospitalImages.length < 5) {
      hospitalImages.push(hospitalImages[hospitalImages.length % hospitalImages.length]);
    }
  }

  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Kauvery Hospital
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            A multi-speciality hospital headquartered in Trichy, Tamil Nadu with a legacy of care since 1997.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Carousel className="w-full max-w-xl mx-auto" plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}>
              <CarouselContent>
                {hospitalImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image ? image.imageUrl : ""} // TODO: Change to image.src when using real images
                      alt={`Kauvery Hospital Facility ${index + 1}`}
                      width={600}
                      height={450}
                      className="rounded-lg mx-auto shadow-lg object-cover h-[400px]"
                    />
                  </CarouselItem>
                ))}
                {hospitalImages.length === 0 && (
                  <CarouselItem>
                    <div className="h-[400px] w-full bg-muted flex items-center justify-center rounded-lg">
                      <Hospital className="h-20 w-20 text-muted-foreground" />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <Card className="text-center h-full">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Hospital className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 font-headline text-2xl">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">
                Kauvery Hospital is a multi-speciality hospital headquartered in Trichy, Tamil Nadu. The institution has branches in Chennai, Salem, Karaikudi, and Hosur.
              </p>
              <p className="text-foreground/70 mt-4">
                In Chennai, it has two branches, one in Alwarpet and another in Anna Nagar.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Section */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-4">
              Detailed Information
            </h2>
            <p className="text-foreground/70 text-lg">
              Kauvery Hospital was founded in 1997 as Sri Kauvery Medical Care by Dr. S. Chandrakumar and Dr. S. Manivannan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Founders/Origins */}
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Hospital className="h-32 w-32 text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Hospital className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-primary">Founding Vision</h3>
              </div>
              <p className="text-foreground/70">
                From its humble beginnings, it has expanded to become a trusted name in healthcare across South India.
              </p>
              {hospitalImages.length > 2 && (
                <Image
                  src={hospitalImages[2].imageUrl}
                  alt="Founding Vision"
                  width={500}
                  height={250}
                  className="rounded-xl w-full h-[250px] object-cover mt-4 shadow-sm"
                />
              )}
            </div>

            {/* Expansion & Growth */}
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="h-32 w-32 text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-primary">Expansion & Growth</h3>
              </div>
              <p className="text-foreground/70">
                The institution now operates multiple branches, each equipped with state-of-the-art medical technology and staffed by experienced healthcare professionals committed to delivering exceptional patient care.
              </p>
              {hospitalImages.length > 3 && (
                <Image
                  src={hospitalImages[3].imageUrl}
                  alt="Expansion & Growth"
                  width={500}
                  height={250}
                  className="rounded-xl w-full h-[250px] object-cover mt-4 shadow-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* History Section - Styled like Apollo's Technology section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-6">
              Our Journey (History)
            </h2>
            <p className="text-foreground/70 mb-6">
              A timeline of growth and commitment to excellence:
            </p>
            <ul className="space-y-4 mb-6">
              {[
                "1997: Kauvery Medical Center started in Trichy as a 30-bed hospital.",
                "2002: Rebranded as Kauvery Hospital.",
                "2004: Launched the first center for treating cardiac diseases in Trichy.",
                "2008: Acquired Seahorse Hospital near Trichy Central Bus Stand.",
                "2011: Established Kauvery Hospital in Alwarpet, Chennai.",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start text-foreground/70">
                  <div className="mt-1 min-w-[20px]">
                    <Pin className="h-5 w-5 text-primary rotate-45" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-foreground/70">
              From a single 30-bed facility to a leading multi-speciality chain, our journey reflects our dedication to patient care.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl bg-muted flex items-center justify-center">
            {hospitalImages.length > 1 ? (
              <Image
                src={hospitalImages[1].imageUrl} // TODO: Change to hospitalImages[1].src when using real images
                alt="Kauvery Hospital History"
                fill
                className="object-cover"
              />
            ) : (
              <Activity className="h-32 w-32 text-muted-foreground/50" />
            )}
          </div>
        </div>

        {/* Infrastructure & Patient Care Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Infrastructure */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">
              World-Class Infrastructure
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                Our facilities are designed to provide the highest standards of medical care:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "State-of-the-art operation theatres with advanced equipment",
                  "Comprehensive ICU and critical care units",
                  "Modern diagnostic and imaging centres",
                  "Dedicated centres of excellence for Specialised treatments",
                  "Patient-friendly infrastructure with comfort amenities",
                ].map((item, index) => (
                  <li key={index} className="flex gap-3 items-start text-foreground/70">
                    <div className="mt-1 min-w-[20px]">
                      <Pin className="h-4 w-4 text-primary rotate-45" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground/70 text-sm">
                Every aspect of our infrastructure is optimized to ensure the best possible outcomes for our patients.
              </p>
            </div>
          </div>

          {/* Patient Care */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">
              Patient-Centric Care
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                At Kauvery Hospital, we prioritize compassionate and Personalised care:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Experienced medical professionals across all specialities",
                  "Personalised treatment plans tailored to individual needs",
                  "24/7 emergency services and patient support",
                  "Comprehensive post-treatment care and follow-up",
                  "Patient education and counselling services",
                ].map((item, index) => (
                  <li key={index} className="flex gap-3 items-start text-foreground/70">
                    <div className="mt-1 min-w-[20px]">
                      <Pin className="h-4 w-4 text-primary rotate-45" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground/70 text-sm">
                We believe in treating patients with dignity, respect, and the highest level of medical expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Healthcare Technology Section - Full Width */}
      <div className="w-full bg-[#70529d] py-20 mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-headline text-3xl font-bold text-white sm:text-4xl">
              Advanced Healthcare Technology & Innovation
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Row 1: 2 Cards */}
            {[
              {
                icon: Activity,
                title: "Advanced Diagnostics",
                desc: "Cutting-edge diagnostic equipment for accurate and timely disease detection."
              },
              {
                icon: Lightbulb,
                title: "Clinical Excellence",
                desc: "Evidence-based medical practices and continuous quality improvement."
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl p-8 w-full md:w-[45%] lg:w-[400px] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#70529d] flex items-center justify-center mb-6 text-white">
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900">{card.title}</h3>
                <p className="text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {/* Row 2: 3 Cards */}
            {[
              {
                icon: Watch,
                title: "Continuous Monitoring",
                desc: "Real-time patient monitoring systems for enhanced safety and care."
              },
              {
                icon: Scan,
                title: "Modern Equipment",
                desc: "Latest medical technology for minimally invasive procedures."
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                desc: "Rigorous quality standards and patient safety protocols."
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl p-8 w-full md:w-[30%] lg:w-[350px] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#70529d] flex items-center justify-center mb-6 text-white">
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900">{card.title}</h3>
                <p className="text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-16 text-center">
          <Link href="/">
            <Button size="lg" className="bg-[#70529d] hover:bg-[#5b4282]">Back to Home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
