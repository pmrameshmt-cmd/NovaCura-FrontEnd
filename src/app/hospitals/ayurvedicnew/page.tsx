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
  Building2,
  Hospital,
  Globe,
  Leaf,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import Footer from "@/components/landing/footer";
import HeroImage from "../../../assets/images/Ayurvedic/Arya Vaidya Sala.png";
import LegacyImage from "../../../assets/images/Ayurvedic/avs-legacy.png";
import WellnessImage from "../../../assets/images/Ayurvedic/avs-wellness.png";

const hospitalDetails = {
  "arya-vaidya-sala": {
    name: "Arya Vaidya Sala (Kottakkal)",
    heroImage: HeroImage,
    quote:
      "Vaidyaratnam P.S. Varier's Arya Vaidya Sala (AVS) is a premier charitable institution committed to the classical practice of Ayurveda.",
    bookingUrl: "/#contact",
    officialUrl: "#",
    overview:
      "Established in 1902 at Kottakkal in Kerala, AVS has been a beacon of authentic Ayurvedic healing for over a century. It manages Ayurvedic hospitals, research centres, and manufacturing units, ensuring the highest standards of traditional treatment.",
    specialities: [
      {
        title: "Authentic Ayurvedic Treatments",
        description: "Rooted In Traditional Ayurvedic Healing Practices",
      },
      {
        title: "Classical Panchakarma",
        description:
          "Detoxification And Rejuvenation Through Ancient Therapies",
      },
      {
        title: "Traditional Therapy Management",
        description:
          "Personalised Treatment Plans For Holistic Wellness And Recovery",
      },
      {
        title: "Research & Development in Ayurveda",
        description:
          "Advancing Traditional Knowledge Through Continuous Innovation",
      },
      {
        title: "Quality Control in Herbal Medicine",
        description:
          "Ensuring Purity Safety And Consistent Excellence In Production",
      },
      {
        title: "In-patient and Out-patient Care",
        description:
          "Comprehensive Support For Every Healing Journey And Wellbeing",
      },
    ],
    locations: [
      {
        icon: Building2,
        title: "Headquarters",
        description: "Kottakkal, Kerala, India",
      },
      {
        icon: Hospital,
        title: "Branch Clinics",
        description: "27 Branch Clinics across major Indian cities",
      },
      {
        icon: Globe,
        title: "Authorized Dealers",
        description: "Authorized Dealers in Middle East and Far East",
      },
    ],
    legacy: {
      years: "120+ Years",
      label: "Legacy of Excellence",
      description:
        "Trusted by generations of international patients annually for authentic Ayurvedic healing and timeless clinical precision.",
      image: LegacyImage,
    },
    wellnessApproach: {
      description:
        "The institution follows the classical textual tradition of Ayurveda, using high-quality herbal medicines and traditional therapies administered by experienced physicians.",
      image: WellnessImage,
      imageQuote: "Healing through nature's precision.",
    },
    integrativeCare: {
      badge: "Integrative Ecosystem",
      title: "Integrative Care",
      description:
        "AVS houses its own herbal estates, factories for medicine production, and an Ayurveda College, fostering a complete ecosystem for traditional medical education and healthcare.",
    },
  },
} as const;

export default function AyurvedicHospitalDetail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
          <p className="text-slate-500">Loading hospital details...</p>
        </div>
      }
    >
      <AyurvedicHospitalContent />
    </Suspense>
  );
}

function AyurvedicHospitalContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  let slug = (params as any)?.slug as string | undefined;
  if (!slug) {
    slug = searchParams?.get("slug") ?? undefined;
  }
  // If still no slug provided, default to the first available hospital
  if (!slug) {
    const keys = Object.keys(hospitalDetails);
    slug = keys.length > 0 ? keys[0] : undefined;
  }
  const hospital = slug
    ? hospitalDetails[slug as keyof typeof hospitalDetails]
    : undefined;

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
        <p className="text-slate-500">Hospital not found.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#F8F9FF] text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Back link */}
        <Link
          href="/#ayurvedic"
          className="inline-flex items-center gap-2 text-[#4A0080] font-semibold text-sm hover:gap-3 transition-all mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ayurvedic
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
            <Image
              src={hospital.heroImage}
              alt={hospital.name}
              fill
              priority
              className="object-cover"
            />
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
              <Link
                href={hospital.bookingUrl}
              
                className="inline-flex items-center gap-2 bg-[#4a0e80] hover:bg-[#3b0b66] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all"
              >
                Book Appointment
                <ExternalLink className="h-4 w-4" />
              </Link>

              {/* <a
                href={hospital.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
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
                  <Info className="h-4.5 w-4.5 text-[#4A0080]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Overview</h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {hospital.overview}
              </p>
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
                  <BriefcaseMedical className="h-4.5 w-4.5 text-[#4A0080]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Key specialities
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-8">
                {hospital.specialities.map((item, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-[#4A0080] text-sm mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Wellness Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden grid grid-cols-1 sm:grid-cols-[45%_55%]"
              style={{ minHeight: "300px" }}
            >
              {/* Left: text — has padding */}
              <div className="flex flex-col p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#4A0080]/10 flex items-center justify-center shrink-0">
                    <Leaf className="h-4 w-4 text-[#4A0080]" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Wellness Approach
                  </h2>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {hospital.wellnessApproach.description}
                </p>
              </div>

              {/* Right: image — flush top/right/bottom, flat left, only right corners rounded */}
              <div className="relative overflow-hidden rounded-[0_24px_24px_0] min-h-[280px] sm:min-h-0">
                <Image
                  src={hospital.wellnessApproach.image}
                  alt="Wellness Approach"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 text-white text-sm font-medium italic leading-snug">
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
                  <MapPin className="h-4.5 w-4.5 text-[#4A0080]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Locations</h2>
              </div>
              <div className="space-y-6">
                {hospital.locations.map((loc, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#4A0080]/10 flex items-center justify-center shrink-0">
                      <loc.icon className="h-4 w-4 text-[#4A0080]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {loc.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {loc.description}
                      </p>
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
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {hospital.legacy.description}
              </p>
              <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden">
                <Image
                  src={hospital.legacy.image}
                  alt="Legacy"
                  fill
                  className="object-cover"
                />
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
          <p className="text-white/80 text-base leading-relaxed">
            {hospital.integrativeCare.description}
          </p>
          <div className="w-12 h-0.5 bg-white/30 mx-auto mt-10" />
        </motion.div>
      </div>

      <Footer />
    </section>
  );
}
