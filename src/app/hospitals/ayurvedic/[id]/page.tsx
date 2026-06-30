
"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import { ayurvedicHospitals } from '@/lib/ayurvedic-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, MapPin, Stethoscope, Heart, Info, Globe, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AyurvedicHospitalDetail() {
  const params = useParams();
  const hospitalId = params.id as string;
  const hospital = ayurvedicHospitals.find((h) => h.id === hospitalId);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">Hospital Not Found</h2>
          <Link href="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex flex-col">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-primary/5">
              {hospital.image ? (
                  <Image
                  src={hospital.image}
                  alt={hospital.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-700"
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center">
                      <Building className="h-32 w-32 text-primary opacity-20" />
                  </div>
              )}
            </div>
            <p className="mt-3 text-sm text-foreground/40 italic text-center md:text-left">
              * Image for representation purposes
            </p>
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary mb-6">
              {hospital.name}
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed italic border-l-4 border-primary/40 pl-6 mb-8">
              "{hospital.intro}"
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={hospital.officialWebsite} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all rounded-full px-8">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official Website
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <Card className="border-none shadow-xl bg-primary/5 overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline text-primary">Overview</h2>
                </div>
                <p className="text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">
                  {hospital.overview}
                </p>
              </CardContent>
            </Card>

            {/* Treatment Focus and specialities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-lg bg-white overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-headline text-primary">Key specialities</h2>
                    </div>
                    <ul className="space-y-3">
                    {hospital.specialities.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/70">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{spec}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-headline text-primary">Wellness Approach</h2>
                    </div>
                    <p className="text-foreground/70 leading-relaxed text-sm">
                    {hospital.approach}
                    </p>
                </CardContent>
                </Card>
            </div>

            {/* Wellness Info */}
            <Card className="border-none shadow-lg bg-primary text-white overflow-hidden rounded-br-[60px]">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Globe className="h-32 w-32" />
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 relative z-10 font-serif">Integrative Care</h3>
                <p className="text-primary-foreground/90 leading-relaxed relative z-10 text-lg">
                  {hospital.wellnessInfo}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Locations */}
            <Card className="border-none shadow-lg bg-white overflow-hidden backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold font-headline text-primary">Locations</h2>
                </div>
                <ul className="space-y-4">
                  {hospital.locations.map((loc, i) => (
                    <li key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-primary/5 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs mt-1">
                        {i+1}
                      </div>
                      <span className="text-foreground/70">{loc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-none shadow-lg bg-white/50 border border-primary/10">
              <CardContent className="p-6">
                 <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop" className="rounded-xl h-32 w-full object-cover mb-4 grayscale opacity-30" alt="Ayurvedic Treatment" />
                    <p className="text-sm italic text-foreground/60 mb-4">"Authentic care for a balanced life."</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Official Link Bottom */}
        <div className="mt-24 pt-12 border-t text-center">
            <p className="text-foreground/60 mb-6">For more information, please visit the official hospital page</p>
            <Link href={hospital.officialWebsite} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white px-12 h-14 text-lg">
                    Visit Official Portal
                    <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
