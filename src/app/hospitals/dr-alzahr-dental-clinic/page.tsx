"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Pin, Activity, Lightbulb, Watch, Scan, ShieldCheck, Smile } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export default function DrAlzahrPage() {
    // Real images extracted from the clinic's website
    const clinicImages = [
        {
            url: "https://lseewdlhieduqsrgfsno.supabase.co/storage/v1/object/public/images/5a4zo253gr-1764764038379.JPG",
            alt: "Dr. Saeed Alzahr and Clinic Area"
        },
        {
            url: "https://lseewdlhieduqsrgfsno.supabase.co/storage/v1/object/public/images/ykyp9p5adzk-1764765045051.png",
            alt: "Dental Treatment Room"
        },
        {
            url: "https://lseewdlhieduqsrgfsno.supabase.co/storage/v1/object/public/images/orbfyekokdg-1764763865781.png",
            alt: "Clinic Reception"
        },
        {
            url: "https://lseewdlhieduqsrgfsno.supabase.co/storage/v1/object/public/images/qfejbzet8ol-1764764784974.png",
            alt: "Clinic Team"
        },
        {
            url: "https://lseewdlhieduqsrgfsno.supabase.co/storage/v1/object/public/images/s3hn3hoix9l-1764767182113.png",
            alt: "Dental Care"
        }
    ];

    return (
        <section id="hospitals" className="py-24 sm:py-32 bg-white text-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-black">
                        Dr. Saeed Alzahr Dental Clinic
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        A state-of-the-art dental facility in Varna, Bulgaria, combining modern medicine with a Personalised approach for your perfect smile.
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
                                {clinicImages.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            width={600}
                                            height={450}
                                            className="rounded-none border border-black shadow-none mx-auto object-cover h-[400px]"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="rounded-none border-black hover:bg-black hover:text-white" />
                            <CarouselNext className="rounded-none border-black hover:bg-black hover:text-white" />
                        </Carousel>
                    </div>

                    <Card className="text-center h-full rounded-2xl rounded-br-[80px] border border-slate-200 shadow-sm bg-white overflow-hidden hover:border-[#70529d] transition-colors">
                        <CardHeader>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-black text-white rounded-none">
                                <Smile className="h-8 w-8" />
                            </div>
                            <CardTitle className="mt-4 font-headline text-2xl text-black">
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700">
                                Located in Chaika, Varna, Dr. Saeed Alzahr Dental Clinic offers comprehensive dental care ranging from routine preventive examinations to complex surgical and aesthetic procedures.
                            </p>
                            <p className="text-slate-700 mt-4">
                                Our philosophy centres on individual attention, ensuring every patient receives a treatment plan tailored to their specific needs, using the latest equipment and techniques.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Information Section */}
                <div className="mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold font-headline text-black mb-4">
                            Detailed Information
                        </h2>
                        <p className="text-slate-600 text-lg">
                            We specialize in restoring smiles through advanced implantology, bone grafting, and aesthetic dentistry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Clinical Excellence */}
                        <div className="bg-white border border-slate-200 p-8 shadow-sm relative overflow-hidden group hover:border-[#70529d] transition-all rounded-br-[80px]">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity className="h-32 w-32 text-black" />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-slate-100 p-3 rounded-none">
                                    <Activity className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold font-headline text-black">Clinical Services</h3>
                            </div>
                            <p className="text-slate-600">
                                Our core services include Dental Implant Placement, Sinus Lift procedures, Bone Grafting, and Soft Tissue Grafts. We are dedicated to restoring both function and aesthetics.
                            </p>
                            <Image
                                src={clinicImages[1].url}
                                alt="Clinical Services"
                                width={500}
                                height={250}
                                className="w-full h-[250px] object-cover mt-4 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* Modern Approach */}
                        <div className="bg-white border border-slate-200 p-8 shadow-sm relative overflow-hidden group hover:border-[#70529d] transition-all rounded-br-[80px]">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Lightbulb className="h-32 w-32 text-black" />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-slate-100 p-3 rounded-none">
                                    <Lightbulb className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold font-headline text-black">Modern Approach</h3>
                            </div>
                            <p className="text-slate-600">
                                We utilize high-class equipment and modern medical practices to ensure precision and comfort. From preventive care to full mouth rehabilitation, quality is our priority.
                            </p>
                            <Image
                                src={clinicImages[2].url}
                                alt="Modern Dental Approach"
                                width={500}
                                height={250}
                                className="w-full h-[250px] object-cover mt-4 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Patient Journey Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-headline text-black mb-6">
                            Your Journey to a Perfect Smile
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Our patient-first approach ensures a comfortable and transparent experience:
                        </p>
                        <ul className="space-y-4 mb-6">
                            {[
                                "Initial Consultation & Diagnosis",
                                "Personalised Treatment Planning",
                                "Preventive Care & Hygiene",
                                "Surgical or Aesthetic Procedures",
                                "Comprehensive Post-Treatment Care",
                            ].map((item, index) => (
                                <li key={index} className="flex gap-3 items-start text-slate-700">
                                    <div className="mt-1 min-w-[20px]">
                                        <Pin className="h-5 w-5 text-black rotate-45" />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-[400px] w-full border border-black bg-slate-50 flex items-center justify-center overflow-hidden">
                        <Image
                            src={clinicImages[3].url}
                            alt="Patient Care"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>

                {/* Infrastructure & Philosophy Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Facility */}
                    <div>
                        <h2 className="text-2xl font-bold font-headline text-black mb-6">
                            Modern Facility
                        </h2>
                        <div className="bg-white border border-slate-200 p-8 shadow-none h-full hover:border-black transition-colors">
                            <p className="font-medium mb-6 text-black">
                                Located in the heart of Varna (Chaika district), our clinic features:
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "State-of-the-art Dental Chairs",
                                    "Sterile & Hygienic Environment",
                                    "Advanced Diagnostic & Imaging Tools",
                                    "Comfortable Waiting Areas",
                                    "Accessible Location",
                                ].map((item, index) => (
                                    <li key={index} className="flex gap-3 items-start text-slate-700">
                                        <div className="mt-1 min-w-[20px]">
                                            <Pin className="h-4 w-4 text-black rotate-45" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Philosophy */}
                    <div>
                        <h2 className="text-2xl font-bold font-headline text-black mb-6">
                            Our Philosophy
                        </h2>
                        <div className="bg-white border border-slate-200 p-8 shadow-none h-full hover:border-black transition-colors">
                            <p className="font-medium mb-6 text-black">
                                We believe in high-quality diagnostics and a Personalised approach:
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Focus on individual patient needs",
                                    "Minimally invasive techniques where possible",
                                    "Transparency in treatment options",
                                    "Commitment to long-term oral health",
                                    "Welcoming international patients",
                                ].map((item, index) => (
                                    <li key={index} className="flex gap-3 items-start text-slate-700">
                                        <div className="mt-1 min-w-[20px]">
                                            <Pin className="h-4 w-4 text-black rotate-45" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialised Treatments Section - Full Width, Purple Background to match reference */}
            <div className="w-full bg-[#70529d] py-20 mt-24 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h2 className="font-headline text-3xl font-bold text-white sm:text-4xl">
                            Specialised Treatments
                        </h2>
                        <p className="mt-4 text-white/80">Comprehensive care using the latest technology.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Row 1 */}
                        {[
                            {
                                icon: Activity,
                                title: "Implantology",
                                desc: "Expert placement of dental implants to restore missing teeth with natural-looking results."
                            },
                            {
                                icon: Smile,
                                title: "Aesthetic Dentistry",
                                desc: "Veneers, whitening, and smile design to enhance your confidence."
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
                        {/* Row 2 */}
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Periodontology",
                                desc: "Treatment of gum diseases and soft tissue management."
                            },
                            {
                                icon: Scan,
                                title: "Digital Diagnostics",
                                desc: "Comprehensive exams using modern imaging technology."
                            },
                            {
                                icon: Watch,
                                title: "Restorative Care",
                                desc: "High-quality fillings, crowns, and bridges for lasting repair."
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
                        <Button size="lg" className="bg-[#70529d] hover:bg-[#5b4282] text-white px-8 py-6 text-lg rounded-xl">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
