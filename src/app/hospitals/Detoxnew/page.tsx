"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
import {
    ArrowLeft,
    ExternalLink,
    Info,
    BriefcaseMedical,
    MapPin,
    Leaf,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import Footer from "@/components/landing/footer";
import buchwilhImage from "@/assets/images/Ayurvedic/Buchinger Wilhelmi.png";
import detoxImage1 from "@/assets/images/Ayurvedic/detoximage1.png";
import detoxImage2 from "@/assets/images/Ayurvedic/detoximage2.png";

const hospitalDetails = {
    "buchinger-wilhelmi": {
        name: "Buchinger Wilhelmi",
        heroImage: buchwilhImage,
        quote:
            "The Buchinger Med Programme is based on more than 100 years of experience and is continually developed in cooperation with university research centres.",
        bookingUrl: "/#contact",
        officialUrl: "#",
        overview:
            "Founded on the discoveries of Dr. Otto Buchinger, the clinic has perfected the art of therapeutic fasting as a key component of a holistic health concept. It aims to empower guests to live healthy and fulfilling lives through a balance of medical care, nutrition, and mental well-being.",
        specialities: [
            {
                title: "Therapeutic Fasting",
                description: "The core Buchinger method for metabolic reset and cellular renewal.",
            },
            {
                title: "Integrative Medicine",
                description: "Combining traditional knowledge with state-of-the-art diagnostics.",
            },
            {
                title: "Longevity & Anti-aging",
                description: "Science-backed strategies to extend healthspan and vitality.",
            },
            {
                title: "Nutritional Strategies",
                description: "Personalised dietary plans following the fasting experience.",
            },
            {
                title: "Weight Management",
                description: "Sustainable pathways to reaching your ideal physiological balance.",
            },
            {
                title: "Detoxification",
                description: "Deep metabolic cleansing supported by medical professionals.",
            },
        ],
        locations: [
            { city: "Lake Constance", country: "Germany" },
            { city: "Marbella", country: "Spain" },
            { city: "Roquefort-les-Pins", country: "Côte d'Azur, France" },
        ],
        legacy: {
            years: "100+ Years",
            label: "Legacy of Therapeutic Fasting",
            description: "Trusted Expertise In Integrative Health And Wellness",
            image: detoxImage2,
        },
        wellnessApproach: {
            description:
                "A holistic methodology that integrates medical supervision with natural therapies, gourmet organic nutrition, and physical activities such as yoga, pilates, and guided nature walks.",
            image: detoxImage1,
            imageQuote: "Authentic care for a balanced life.",
        },
        integrativeCare: {
            badge: "Integrative Ecosystem",
            title: "Integrative Care",
            description:
                "The clinics focus on sustainability and are aligned with UN Global Sustainable Development Goals, providing an environment that nourishes the body, mind, and soul through art, culture, and nature.",
        },
    },
};

export default function DetoxHospitalDetail() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
                    <p className="text-slate-500">Loading hospital details...</p>
                </div>
            }
        >
            <DetoxHospitalContent />
        </Suspense>
    );
}

function DetoxHospitalContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    let slug = params?.slug as string;
    if (!slug) slug = searchParams?.get("slug") as string;
    const hospital = hospitalDetails[slug as keyof typeof hospitalDetails];

    if (!hospital) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
                <p className="text-slate-500">Hospital not found.</p>
            </div>
        );
    }

    return (
        <section className="bg-[#F8F9FF] text-slate-900 min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

                {/* Back link */}
                <Link
                    href="/#detox"
                    className="inline-flex items-center gap-2 text-[#4A0080] font-semibold text-sm hover:gap-3 transition-all mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Detox
                </Link>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16"
                >
                    <div className="lg:col-span-6 relative w-full aspect-[3/2] rounded-[28px] overflow-hidden shadow-lg">
                        <Image src={hospital.heroImage} alt={hospital.name} fill priority className="object-cover" />
                    </div>

                    <div className="lg:col-span-6 space-y-6">
                        <h1
                            className="text-4xl sm:text-5xl font-bold tracking-tight text-[#4A0080]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {hospital.name}
                        </h1>

                        <blockquote className="border-l-4 border-[#4A0080] pl-4 italic text-slate-600 text-sm sm:text-base leading-relaxed">
                            "{hospital.quote}"
                        </blockquote>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href={hospital.bookingUrl}
                                className="inline-flex items-center gap-2 bg-[#4a0e80] hover:bg-[#3b0b66] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all"
                            >
                                Book Appointment
                                <ExternalLink className="h-4 w-4" />
                            </a>
                            {/* <a
                                href={hospital.officialUrl}
                                className="inline-flex items-center gap-2 border-2 border-[#4A0080] text-[#4A0080] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#4A0080]/5 transition-all"
                            >
                                Visit Official Portal
                            </a> */}
                        </div>
                    </div>
                </motion.div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left column */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-[#4A0080]/10 flex items-center justify-center">
                                    <Info className="h-5 w-5 text-[#4A0080]" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Overview</h2>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{hospital.overview}</p>
                        </motion.div>

                        {/* Key specialities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-[#4A0080]/10 flex items-center justify-center">
                                    <BriefcaseMedical className="h-5 w-5 text-[#4A0080]" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Key specialities</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-8">
                                {hospital.specialities.map((item, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-[#4A0080] text-sm mb-1.5">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                       <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ duration: 0.6 }}
                           className="bg-white rounded-[24px] overflow-hidden grid grid-cols-[45%_55%]"
                          style={{ minHeight: '300px' }}
>
  {/* Left: text */}
  <div className="flex flex-col p-9 pr-7">
    <div className="flex items-center gap-3 mb-7">
      <div className="w-11 h-11 rounded-xl bg-[#6b3fd4]/10 flex items-center justify-center shrink-0">
        <Leaf className="h-5 w-5 text-[#6b3fd4]" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Wellness Approach</h2>
    </div>
    <p className="text-slate-500 text-[15px] leading-[1.85]">
      {hospital.wellnessApproach.description}
    </p>
  </div>

  {/* Right: image — zero margin, bleeds flush to card edges, only right corners rounded */}
  <div className="relative overflow-hidden rounded-[0_24px_24px_0]">
    <Image
      src={hospital.wellnessApproach.image}
      alt="Wellness Approach"
      fill
      className="object-cover object-top"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
    <p className="absolute bottom-5 left-5 right-5 text-white text-[15px] font-medium italic leading-[1.55]">
      "{hospital.wellnessApproach.imageQuote}"
    </p>
  </div>
</motion.div>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Locations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-[#4A0080]/10 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-[#4A0080]" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Locations</h2>
                            </div>
                            <div className="space-y-5">
                                {hospital.locations.map((loc, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-[#4A0080] mt-2 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{loc.city}</h4>
                                            <p className="text-slate-500 text-sm">({loc.country})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Legacy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 text-center"
                        >
                            <h2
                                className="text-3xl font-bold text-[#4A0080] mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {hospital.legacy.years}
                            </h2>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                                {hospital.legacy.label}
                            </p>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{hospital.legacy.description}</p>
                            <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden">
                                <Image src={hospital.legacy.image} alt="Legacy" fill className="object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Integrative Care - full bleed band */}
            <div className="mt-16 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#4A0080] px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 tracking-wide mb-6">
                        {hospital.integrativeCare.badge}
                    </span>
                    <h2
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {hospital.integrativeCare.title}
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed">{hospital.integrativeCare.description}</p>
                    <div className="w-12 h-0.5 bg-white/30 mx-auto mt-10" />
                </motion.div>
            </div>
             <Footer />
        </section>
    );
}