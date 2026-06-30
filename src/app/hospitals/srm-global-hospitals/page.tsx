"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import srmImage1 from '@/assets/images/SRM/srm-1.jpg';
import srmImage2 from '@/assets/images/SRM/srm-2.jpg';
import srmImage3 from '@/assets/images/SRM/srm-3.png';
import srmImage4 from '@/assets/images/SRM/srm-4.jpeg';
import srmImage5 from '@/assets/images/SRM/srm.png';
import Autoplay from "embla-carousel-autoplay"

const hospitalImages = [
  { src: srmImage1, alt: 'SRM Hospital Image 1' },
  { src: srmImage2, alt: 'SRM Hospital Image 2' },
  { src: srmImage3, alt: 'SRM Hospital Image 3' },
  { src: srmImage4, alt: 'SRM Hospital Image 4' },
  { src: srmImage5, alt: 'SRM Hospital Image 5' },
];

export default function SrmGlobalHospitalsPage() {
  return (
    <section id="hospitals" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            SRM Global Hospitals
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
                      className="rounded-lg mx-auto shadow-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Hospital className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 font-headline text-2xl">
                SRM Global Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">
                Step into our realm, where more than 200 beds stand as silent sentinels of care and compassion. With over 30 specialities under our banner, we offer a comprehensive array of healthcare services that cater to your every need. From the moment you cross our threshold, a saga of exceptional medical care begins to unfold.
              </p>
              <p className="text-foreground/70 mt-4">
                SRM Global Hospitals, etched through years of tireless dedication and a passion for nurturing lives. We invite you to become a part of this story, where the chapters are filled with healing, hope, and the promise of a healthier tomorrow.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Medical Technology Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline text-foreground/90 mb-6">
              Advanced Medical Technology
            </h2>
            <p className="text-foreground/70 mb-6">
              As a Leading healthcare provider of chennai, SRM Global Hospitals,
              we invest in state-of-the-art systems to support every stage of your
              healthcare journey:
            </p>
            <ul className="space-y-4 mb-6">
              {[
                "High-precision imaging tools and surgical devices",
                "Robotic surgery and digital operating rooms",
                "Fully equipped testing and calibration laboratories",
                "Technology-integrated ICUs and critical care units",
                "Compliant calibration laboratories for equipment safety",
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
              These technological advancements ensure that we maintain the
              highest standards in patient outcomes and safety, solidifying our
              reputation as one of the best hospitals in the region.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={srmImage2}
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
              Infrastructure That Heals
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                Our hospital campus has been thoughtfully designed with healing in
                mind:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Spacious rooms and recovery areas",
                  "Infection-controlled modular operation theatres",
                  "Emergency bays and quick-access zones",
                  "Separate wings for different specialities",
                  "Ample parking and patient support services",
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
                Every detail—from room ventilation to waiting lounges—is
                optimized for your well-being.
              </p>
            </div>
          </div>

          {/* Patient Care */}
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">
              Patient Care beyond Expectations
            </h2>
            <div className="bg-background border rounded-2xl p-8 shadow-sm h-full rounded-br-[80px]">
              <p className="font-medium mb-6">
                We follow a patient-first philosophy, ensuring that:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "You are seen, heard, and understood at every step",
                  "Treatment plans are customised to your unique needs",
                  "Emotional support and counselling are readily available",
                  "Our nursing staff is accessible 24/7 for comfort and care",
                  "We respect your time and minimise wait periods",
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
                Our goal is not just to treat, but to heal—physically, mentally,
                and emotionally.
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
              Advanced AI-Based Monitoring at SRM Global Hospitals, Chennai
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Row 1: 2 Cards */}
            {[
              {
                icon: Activity,
                title: "Real-Time Remote Monitoring",
                desc: "Continuous tracking of patient health, even outside hospital settings."
              },
              {
                icon: Lightbulb,
                title: "Proactive Alerts",
                desc: "AI-powered early warning system for timely clinical intervention."
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
                title: "Smart Vital Tracking",
                desc: "Automated monitoring of critical health parameters using AI."
              },
              {
                icon: Scan,
                title: "Touch-Free Monitoring",
                desc: "Contactless technology for safe and hygienic vitals assessment."
              },
              {
                icon: ShieldCheck,
                title: "Enhanced Safety & Outcomes",
                desc: "Improved patient safety, faster response times, and better clinical results."
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
