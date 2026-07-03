"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck, Pill, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import apolloImage1 from '@/assets/images/Apollo/apollo-1.png';
import apolloImage2 from '@/assets/images/Apollo/apollo-2.png';
import apolloImage3 from '@/assets/images/Apollo/apollo-3.png';
import apolloImage4 from '@/assets/images/Apollo/apollo-4.png';
import apolloImage5 from '@/assets/images/Apollo/apollo-5.png';
import Autoplay from "embla-carousel-autoplay"

const hospitalImages = [
  { src: apolloImage1, alt: 'Apollo Hospital Exterior' },
  { src: apolloImage2, alt: 'Advanced Medical Technology' },
  { src: apolloImage3, alt: 'Patient Care Area' },
  { src: apolloImage4, alt: 'Apollo Pharmacy' },
  { src: apolloImage5, alt: 'Apollo 24/7 Digital Platform' },
];

export default function ApolloHospitalsPage() {
  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Apollo Hospitals
          </h2>
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
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={450}
                      className="rounded-lg mx-auto shadow-lg object-cover h-[400px]"
                    />
                  </CarouselItem>
                ))}
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
                Apollo Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">
                Apollo Hospitals is a pioneer in integrated healthcare delivery in India, Turkey and Bulgaria. Since its inception, the group has touched the lives of over 150 million patients from 140 countries. We are driven by a single goal: to provide the best standards of care to every patient.
              </p>
              <p className="text-foreground/70 mt-4">
                With a legacy of innovation and excellence, Apollo Hospitals continues to lead the way in advanced medical treatments and compassionate patient care, setting benchmarks in the healthcare industry.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Apollo HealthCo Section */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-4">
              Apollo HealthCo
            </h2>
            <p className="text-foreground/70 text-lg">
              Apollo HealthCo was formed in 2021 with the merger of the group's non-hospital pharmacy chain Apollo Pharmacy and its digital healthcare business known as Apollo 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Apollo Pharmacy */}
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Pill className="h-32 w-32 text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <Pill className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-primary">Apollo Pharmacy</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Apollo Pharmacy is the largest retail pharmacy chain in India, Turkey and Bulgaria with more than 5,000 stores in over 21 states. It was started in 1987.
              </p>
              <Image
                src={apolloImage4}
                alt="Apollo Pharmacy"
                className="rounded-xl w-full h-[250px] object-cover mt-4 shadow-sm"
              />
            </div>

            {/* Apollo 24/7 */}
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone className="h-32 w-32 text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-primary">Apollo 24/7</h3>
              </div>
              <p className="text-foreground/70 mb-4">
                Apollo 24/7 is the digital healthcare platform of the group which was launched in 2020. It offers telehealth consultation, online medicine ordering and delivery, and in-home diagnostics among other services.
              </p>
              <Image
                src={apolloImage5}
                alt="Apollo 24/7"
                className="rounded-xl w-full h-[250px] object-cover mt-4 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced Medical Technology Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-6">
              Advanced Medical Technology
            </h2>
            <p className="text-foreground/70 mb-6">
              As a global leader in healthcare, Apollo Hospitals invests in cutting-edge systems to revolutionise patient care and treatment outcomes:
            </p>
            <ul className="space-y-4 mb-6">
              {[
                "Proton Beam Therapy for precise cancer treatment",
                "Da Vinci Robotic Surgical System for minimally invasive surgeries",
                "CyberKnife for non-invasive radiation therapy",
                "Advanced 320 Slice CT Scanners for rapid imaging",
                "TrueBeam STx for targeted radiosurgery",
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
              These pioneering technologies enable us to perform complex procedures with greater precision, reduced recovery times, and superior clinical outcomes.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={apolloImage2}
              alt="Advanced Medical Technology"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Infrastructure & Patient Care Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Infrastructure */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">
              Infrastructure of Excellence
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                Our facilities are designed to meet international standards of safety and comfort:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "JCI accredited hospitals ensuring global quality standards",
                  "Dedicated centres of Excellence for key specialities",
                  "State-of-the-art organ transplant suites",
                  "Luxury patient suites with Personalised services",
                  "Comprehensive emergency and trauma care centres",
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
                We create an environment that fosters healing and provides peace of mind to patients and their families.
              </p>
            </div>
          </div>

          {/* Patient Care */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">
              Tender Loving Care (TLC)
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                At Apollo, our unique Tender Loving Care (TLC) approach ensures:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Compassionate care that treats the patient, not just the ailment",
                  "Holistic support addressing physical and emotional needs",
                  "Patient-centric service delivery at every touchpoint",
                  "Dedicated patient care coordinators",
                  "Transparent communication and counselling",
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
                We believe that a caring touch is as important as the cure itself.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced AI-Based Monitoring Section - Full Width */}
      <div className="w-full bg-[#70529d] py-20 mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-headline text-3xl font-bold text-white sm:text-4xl">
              Future of Healthcare: AI & Connected Care
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Row 1: 2 Cards */}
            {[
              {
                icon: Activity,
                title: "Apollo ProHealth",
                desc: "AI-powered proactive health management program."
              },
              {
                icon: Lightbulb,
                title: "Clinical Intelligence",
                desc: "Leveraging big data for predictive diagnosis and Personalised treatment."
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
                title: "Connected Care",
                desc: "Seamless continuity of care from hospital to home via digital tools."
              },
              {
                icon: Scan,
                title: "Precision Medicine",
                desc: "Genomic screening and targeted therapies for better outcomes."
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                desc: "AI-driven monitoring of clinical quality indicators."
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
