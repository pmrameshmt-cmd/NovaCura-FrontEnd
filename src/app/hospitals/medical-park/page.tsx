"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Hospital,
  Pin,
  Activity,
  Lightbulb,
  Watch,
  Scan,
  ShieldCheck,
  DollarSign,
  Scale,
  Calendar,
  Rocket,
  Banknote,
  Users,
  Plane,
  Crown,
  TreePalm,
  Languages,
  FileText,
  UserCheck,
  PlaneTakeoff,
  Award,
  ArrowLeft,
  ArrowRight,
  Globe,
  Heart,
  Bot,
  HeartPulse,
  Dna,
} from "lucide-react";
import Footer from "@/components/landing/footer";

// --- Asset Images ---
import Banner from "../../../assets/images/Turkey/Banner.png";
import Container1 from "../../../assets/images/Turkey/Container1.png";
import CentersofExcellence from "../../../assets/images/Turkey/Centers of Excellence.png";
import MedicalExcellence from "../../../assets/images/Turkey/Medical Excellence.png";
import container2 from "../../../assets/images/Turkey/Container 2.png";
import DentalTreatment from "../../../assets/images/Turkey/DentalTreatment.png";
import PlasticSurgery from "../../../assets/images/Turkey/PlasticSurgery.png";
import Cardiology from "../../../assets/images/Turkey/Cardiology.png";
import HairTransplant from "../../../assets/images/Turkey/HairTransplant.png";
import EyeSurgery from "../../../assets/images/Turkey/EyeSurgery.png";
import TurkeyBg from "../../../assets/images/Turkey/turkey-bg.png";
import whyTurkeyBg from "../../../assets/images/Turkey/why-turkey.png";

import { PlaceHolderImages } from "@/lib/placeholder-images";

// --- TypeScript Interfaces ---
interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CityStat {
  name: string;
  clinicsCount: number;
  position: {
    top: string;
    left: string;
  };
}

const steps: Step[] = [
  {
    id: 1,
    title: "Get Quote",
    description:
      "Submit your medical reports for a Personalised treatment plan and cost estimate.",
    icon: DollarSign,
  },
  {
    id: 2,
    title: "Compare",
    description:
      "Review multiple hospital options and specialist profiles tailored to your needs.",
    icon: Scale,
  },
  {
    id: 3,
    title: "Plan",
    description:
      "Coordinate your travel, accommodation, and hospital appointments with our concierge.",
    icon: Calendar,
  },
  {
    id: 4,
    title: "Get Treated",
    description:
      "Receive world-class medical care and enjoy a comfortable recovery in Turkey.",
    icon: Rocket,
  },
];

const translationServices = [
  {
    id: 1,
    title: "Document Translation",
    description:
      "Medical reports, test results, and prescriptions translated with clinical accuracy.",
    icon: FileText,
  },
  {
    id: 2,
    title: "Hospital Interpretation",
    description:
      "Personal language assistance during all doctor visits and consultations.",
    icon: UserCheck,
  },
  {
    id: 3,
    title: "Escort Service",
    description:
      "Seamless airport pickup and hospital transfer with a native-speaking escort.",
    icon: PlaneTakeoff,
  },
  {
    id: 4,
    title: "Certified Translation",
    description:
      "Notarized official translations for international medical insurance and legalities.",
    icon: Award,
  },
];

const cities: CityStat[] = [
  {
    name: "Istanbul",
    clinicsCount: 450,
    position: { top: "25%", left: "15%" },
  },
  { name: "Izmir", clinicsCount: 100, position: { top: "60%", left: "8%" } },
  { name: "Ankara", clinicsCount: 20, position: { top: "20%", left: "52%" } },
  { name: "Antalya", clinicsCount: 180, position: { top: "72%", left: "36%" } },
];

const features = [
  { icon: ShieldCheck, title: "JCI Accredited Hospitals", x: "12%", y: "4%" },
  { icon: Banknote, title: "Affordable Prices", x: "62%", y: "18%" },
  { icon: Users, title: "Expert Medical Team", x: "22%", y: "40%" },
  { icon: Plane, title: "Easy Access", x: "66%", y: "58%" },
  { icon: Crown, title: "VIP Services", x: "24%", y: "78%" },
  { icon: TreePalm, title: "Holiday & Treatment", x: "60%", y: "92%" },
];

// 1. Parent container variant orchestrating staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Delay sequence gap between each timeline point
      delayChildren: 0.1,
    },
  },
};

// 2. Child variant for sequential entry text nodes
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// 3. Simple fade/scale-up layout configuration for the right side image hero
const imageVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const timelineData = [
  { title: "1993", desc: "Established the first Medical Park hospital." },
  {
    title: "Expansion Era",
    desc: "Expanded to become Turkey's largest private hospital group with 25 locations.",
  },
  {
    title: "Pioneering Surgery",
    desc: "Pioneered organ transplantation surgeries in the private sector in Turkey.",
  },
  {
    title: "Partnerships",
    desc: "Partnered with leading universities to foster academic medical excellence.",
  },
  {
    title: "Patient Safety Excellence",
    desc: "Consistently awarded for patient safety and service quality.",
  },
];

const treatmentCategories = [
  {
    title: "Dental Treatment",
    description: "Implants, veneers, smile design and more",
    clinics: "350+ clinics",
    imgSrc:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    isLarge: true,
  },
  {
    title: "Plastic Surgery",
    description: "Rhinoplasty, liposuction, breast surgery, facelift",
    clinics: "280+ clinics",
    imgSrc:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    isLarge: true,
  },
  {
    title: "Hair Transplant",
    description: "",
    clinics: "200+ clinics",
    imgSrc:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    isLarge: false,
  },
  {
    title: "Cardiology",
    description: "",
    clinics: "120+ clinics",
    imgSrc:
      "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80",
    isLarge: false,
  },
  {
    title: "Eye Surgery",
    description: "",
    clinics: "150+ clinics",
    imgSrc:
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
    isLarge: false,
  },
];

const timelineItems = [
  {
    icon: Bot,
    title: "Robotic Surgery",
    desc: "Utilizing Da Vinci Robotic Surgery systems for precise and minimally invasive operations.",
    above: true,
  },
  {
    icon: HeartPulse,
    title: "Advanced Oncology",
    desc: "Equipped with Tomotherapy and Gamma Knife technologies for targeted cancer treatment.",
    above: false,
  },
  {
    icon: Dna,
    title: "Genetic Diagnosis",
    desc: "State-of-the-art genetic labs for early diagnosis and Personalised medicine.",
    above: true,
  },
  {
    icon: Scan,
    title: "Diagnostic Imaging",
    desc: "Latest MRI (3 Tesla), PET-CT, and digital mammography systems.",
    above: false,
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    desc: "Strict adherence to JCI international safety and quality standards.",
    above: true,
  },
];

export default function MedicalParkPage() {
  const hospitalImages = PlaceHolderImages.filter(
    (img) =>
      img.imageHint.includes("hospital") || img.imageHint.includes("doctor"),
  ).slice(0, 5);

  if (hospitalImages.length > 0) {
    while (hospitalImages.length < 5) {
      hospitalImages.push(
        hospitalImages[hospitalImages.length % hospitalImages.length],
      );
    }
  }

  // ── Lenis Smooth Scroll Setup ──
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  //CountUp component for animations
  function CountUp({
    end,
    duration = 1000,
    prefix = "",
    suffix = "",
    separator = false,
  }: {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    separator?: boolean;
  }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const hasRun = useRef(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
      if (!isInView || hasRun.current) return;
      hasRun.current = true;

      let frame: number;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * end));
        if (progress < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frame);
    }, [isInView, end, duration]);

    const display = separator
      ? value.toLocaleString("en-US")
      : value.toString();

    return (
      <span ref={ref}>
        {prefix}
        {display}
        {suffix}
      </span>
    );
  }

  return (
    <section id="hospitals" className=" bg-white">
      {/* 1st Section: Expanded Premium Hero Section */}
      <div className="relative w-full min-h-[750px] flex items-center bg-slate-900 overflow-hidden py-20 sm:py-24">
        {/* Background Image Banner */}
        <Image
          src={Banner}
          alt="Medical Park Banner"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Fine-Tuned Exact Linear Gradient Overlay Layer */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(89.61deg, rgba(248, 249, 255, 0.95) 0.14%, rgba(248, 249, 255, 0.4) 42.3%, rgba(248, 249, 255, 0) 85.5%)",
          }}
        />

        {/* FIXED: Top-Left Absolute Positioned Back Button Wrapper */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-20">
          <Link href="/" className="inline-block">
            <button className="group relative flex  items-center justify-center gap-[10px] overflow-hidden rounded-full border border-white/35 bg-white/18 p-2.5 text-slate-900 opacity-80 shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(255,255,255,0.05)] backdrop-blur-[20px] backdrop-saturate-[180%] transition-all duration-300 transform active:scale-95 hover:opacity-100">
              <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-to-br from-white/35 via-transparent via-[45%] to-transparent" />
              <div className="relative flex items-center justify-center transition-transform group-hover:-translate-x-1 duration-200">
                <ArrowLeft className="h-full w-full text-[#4A0080]" />
              </div>
              <span className="relative font-sans text-base font-semibold text-[#0B1C30]">
                Back to home
              </span>
            </button>
          </Link>
        </div>

        {/* Overlay Content Container */}
        <div className="relative max-w-7xl mx-auto z-10 w-full px-4 sm:px-6 lg:px-8">
          {/* Removed old wrapper inside this container to clear extra margin offsets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-left flex flex-col items-start space-y-4 sm:space-y-5 mt-8 sm:mt-12"
          >
            {/* Accreditation Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 tracking-wide"
            >
              JCI Accredited Excellence
            </motion.span>

            <div className="flex flex-col gap-4 sm:gap-6 w-full">
              {/* Heading Section */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-serif text-4xl sm:text-5xl font-bold leading-tight sm:leading-[56px] text-[#0B1C30] tracking-tight"
              >
                Medical Park
              </motion.h1>

              {/* Description Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-inter text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#0B1C30] max-w-md"
              >
                Turkey's largest private hospital group, delivering world-class
                healthcare with JCI-accredited standards since 1993. Experience
                precision medicine and human-centric care in the heart of
                Eurasia.
              </motion.p>

              {/* Quick Stats Badges - Upscaled Variant */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-2 sm:gap-4 pt-2 w-full"
              >
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-100 bg-white/95 px-3 sm:px-6 py-1.5 sm:py-1 font-sans text-xs sm:text-base font-semibold text-slate-900 shadow-md backdrop-blur-sm">
                  <Hospital className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-xs sm:text-base">
                    <CountUp end={25} duration={2} /> Hospitals
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-100 bg-white/95 px-3 sm:px-6 py-1.5 sm:py-1 font-sans text-xs sm:text-base font-semibold text-slate-900 shadow-md backdrop-blur-sm">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-xs sm:text-base">
                    <CountUp end={5200} duration={2} suffix="+" /> Beds
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-100 bg-white/95 px-3 sm:px-6 py-1.5 sm:py-1 font-sans text-xs sm:text-base font-semibold text-slate-900 shadow-md backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-xs sm:text-base">
                    <CountUp end={200} duration={2} suffix="+" /> OT
                  </span>
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-2 sm:pt-3 w-full"
              >
                <a href="/#contact">
                  <Button className="w-full sm:w-auto rounded-lg sm:rounded-xl bg-[#4a0e80] px-6 sm:px-8 py-3 sm:py-8 font-sans text-sm sm:text-base font-semibold text-white shadow-lg shadow-purple-900/20 transition-all hover:bg-[#3b0b66]">
                    Book Appointment
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* 2nd Section: Overview & Department Excellence Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center"
        >
          {/* Left Side Visual Frame */}
          <div className="lg:col-span-6 bg-[#ebf3f6] p-4 sm:p-6 rounded-[24px] sm:rounded-[36px] relative">
            <div className="relative overflow-hidden rounded-[16px] sm:rounded-[24px] aspect-[4/3] bg-slate-100">
              <Image
                src={Container1}
                alt="Medical Park Department Doctors"
                className="object-contain h-full w-full"
                priority
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-3 sm:bottom-4 right-3 sm:right-6 text-white flex flex-col justify-center px-3 sm:px-6 py-3 sm:py-5 z-20 select-none pointer-events-none rounded-xl sm:rounded-2xl min-w-[160px] sm:min-w-[210px] h-[80px] sm:h-[100px]"
                style={{
                  backgroundColor: "rgba(12, 18, 27, 0.45)",
                  backdropFilter: "blur(16px) saturate(160%)",
                  WebkitBackdropFilter: "blur(16px) saturate(160%)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                }}
              >
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none font-serif">
                  <CountUp end={5200} duration={1400} suffix="+" />
                </div>
                <div className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300 mt-1.5 sm:mt-2 leading-none">
                  Patient Beds
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side Content Section */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#115e6e]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#115e6e]">
                  Overview
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4A0080]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Excellence in Every Department
              </h2>

              <div className="space-y-4 text-slate-600 text-[15px] sm:text-base leading-relaxed font-normal">
                <p>
                  Medical Park Hospitals Group is the largest healthcare group
                  in Turkey, operating 25 hospitals with over 5,200 beds and 200
                  operating theatres.
                </p>
                <p>
                  Renowned for its "Health for Everybody" philosophy, Medical
                  Park combines academic excellence with Patient-centred
                  service, attracting patients from across the globe.
                </p>
              </div>
            </motion.div>

            {/* Integrated Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 pt-4"
            >
              <div className="border-l-2 border-[#115e6e] pl-4 space-y-0.5">
                <div className="text-3xl font-extrabold text-[#115e6e] tracking-tight">
                  <CountUp end={25} duration={1400} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  Modern Hospitals
                </div>
              </div>
              <div className="border-l-2 border-[#115e6e] pl-4 space-y-0.5">
                <div className="text-3xl font-extrabold text-[#115e6e] tracking-tight">
                  <CountUp end={200} duration={1400} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  Operating Rooms
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 3rd Section: Detailed Information Section */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2
              className="text-4xl font-bold tracking-tight mb-4 text-[#4A0080]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Detailed Information
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
              A leader in the healthcare sector, Medical Park is known for its
              high success rates in organ transplantation and oncology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Side Feature Card (centres of Excellence) */}
            <div className="lg:col-span-8 relative overflow-hidden rounded-[24px] min-h-[440px] flex flex-col justify-end p-8 sm:p-10 group shadow-md">
              <Image
                src={CentersofExcellence}
                alt="Centers of Excellence"
                fill
                priority
                className="object-cover object-center z-0 transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Teal-tinted Dark Gradient Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#022323]/95 via-[#022323]/40 to-transparent z-10" />

              {/* Text Content Overlay */}
              <div className="relative z-20 max-w-xl text-left">
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  centres of Excellence
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light opacity-90">
                  The group hosts Specialised centres for Organ Transplantation,
                  Bone Marrow Transplantation, Oncology, IVF, and Neurosurgery,
                  achieving survival rates comparable to world-leading
                  institutions.
                </p>
              </div>
            </div>

            {/* Right Side Column Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Top Block: Global Recognition */}
              <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-md transition-shadow flex flex-col justify-center text-left flex-1">
                <div className="w-12 h-12 rounded-full bg-[#054646]/10 flex items-center justify-center mb-5">
                  <Globe className="h-6 w-6 text-[#054646]" />
                </div>
                <h3 className="text-xl font-bold text-[#054646] mb-2">
                  Global Recognition
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Medical Park Goztepe Hospital and others in the group are JCI
                  accredited, ensuring compliance with rigorous international
                  healthcare quality standards.
                </p>
              </div>

              {/* Bottom Block: Patient Satisfaction Counter */}
              <div className="bg-[#014040] rounded-[24px] p-8 relative overflow-hidden min-h-[160px] flex flex-col justify-center text-left shadow-md">
                <div className="relative z-10">
                  <div className="text-[44px] font-extrabold text-white leading-none tracking-tight flex items-baseline gap-1 mb-2">
                    <span>
                      <CountUp end={100} duration={1000} />
                    </span>
                    <span className="text-2xl font-semibold text-teal-300">
                      %
                    </span>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-teal-100/90">
                    Patient Satisfaction
                  </div>
                </div>

                {/* Background Decorative Heart Outline */}
                <div className="absolute bottom-[-24px] right-[-24px] opacity-10 pointer-events-none">
                  <Heart className="h-44 w-44 text-white stroke-[1.25]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4th Section: Our Journey (History) */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Animated Vertical Timeline Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Header Block Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#115e6e]" />
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#115e6e]">
                  Our Journey
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#4A0080]">
                A Legacy of Medical Innovation
              </h2>
            </div>

            {/* Visual Timeline Base Line Container */}
            <div className="relative pl-8 border-l border-slate-200 space-y-10 ml-3 mt-6">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Timeline Indicator Node Bullet */}
                  <div className="absolute left-[-45px] top-0.5 h-6 w-6 rounded-full bg-[#032b30] border-4 border-white transition-transform duration-300 group-hover:scale-110 shadow-[0_0_0_4px_rgba(0,51,60,0.05)]" />

                  <div className="space-y-1 pl-1">
                    <h4 className="text-base font-bold font-sans text-[#4A0080] tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 font-sans text-sm sm:text-[15px] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Image Container with entry fade-up configuration */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={imageVariants}
            className="lg:col-span-6 flex justify-center lg:justify-end relative w-full"
          >
            <div className="relative overflow-hidden bg-slate-50 w-full max-w-[584px] aspect-[584/456] lg:w-[584px] lg:h-[456px] rounded-bl-[48px] rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] shadow-[0px_15px_20px_-12px_#70529D]">
              <Image
                src={MedicalExcellence}
                alt="Medical Excellence Laptop Interface Diagnostics"
                fill
                sizes="(max-width: 1024px) 100vw, 584px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Infrastructure & Patient Care Section */}
        <div className="mt-24 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#4A0080] px-6 sm:px-12 lg:px-20 py-16">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading, Stats, Accessibility note */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  World-Class Infrastructure &amp; Patient-Centric Care
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  "Health for Everybody" is not just a slogan, but our daily
                  practice. Our facilities are designed for complex medical
                  interventions, featuring advanced organ transplant centres and
                  genetic diagnosis centres.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                    <CountUp end={25} duration={900} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mt-2">
                    Hospitals
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                    <CountUp end={200} duration={900} suffix="+" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mt-2">
                    Operating theatres
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                    <CountUp end={5200} duration={1200} suffix="+" separator />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mt-2">
                    Patient Beds
                  </div>
                </div>
                {/* "Smart" stays as-is — it's text, not a number */}
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                    Smart
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mt-2">
                    Eco-Designs
                  </div>
                </div>
              </div>

              {/* Accessibility Note */}
              <div className="bg-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                <Pin className="h-4 w-4 text-white shrink-0" />
                <span className="text-white/90 text-sm">
                  Accessible high-quality care across 17 major cities in Turkey.
                </span>
              </div>
            </div>

            {/* Right Column: Image with floating badges */}
            <div className="lg:col-span-7 relative">
              <div className="relative overflow-hidden rounded-[24px] aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/13]">
                <Image
                  src={container2}
                  alt="Patient Centric Care Room"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Badge: Multidisciplinary Approach */}
              <div className="absolute left-[-32px] sm:left-[-16px] top-1/2 -translate-y-[60px] bg-white rounded-2xl shadow-lg pl-3 pr-5 py-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#054646]/10 flex items-center justify-center shrink-0">
                  <Users className="h-3.5 w-3.5 text-[#054646]" />
                </div>
                <span className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                  Multidisciplinary Approach
                </span>
              </div>

              {/* Floating Badge: International Patient Center */}
              <div className="absolute left-[-32px] sm:left-[-16px] top-1/2 translate-y-[8px] bg-white rounded-2xl shadow-lg pl-3 pr-5 py-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#054646]/10 flex items-center justify-center shrink-0">
                  <Globe className="h-3.5 w-3.5 text-[#054646]" />
                </div>
                <span className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                  International Patient Center
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Feature Row */}
          <div className="max-w-[1600px] mx-auto mt-12 pt-10 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div>
              <h4 className="text-teal-300 text-sm font-bold mb-2">
                Multidisciplinary
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Integrated approach for complex cases like Oncology and
                Transplants.
              </p>
            </div>
            <div>
              <h4 className="text-teal-300 text-sm font-bold mb-2">
                International
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Dedicated assistance for global patients with travel and
                accommodation.
              </p>
            </div>
            <div>
              <h4 className="text-teal-300 text-sm font-bold mb-2">
                Success Rates
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Benchmark-setting survival rates in life-saving global
                procedures.
              </p>
            </div>
            <div>
              <h4 className="text-teal-300 text-sm font-bold mb-2">
                Collaboration
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Strategic partnerships with top universities for cutting-edge
                treatments.
              </p>
            </div>
          </div>
        </div>

        {/* Technology & Innovation - Horizontal Timeline */}
        <div className="w-full bg-white py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-20"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[#4A0080]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Technology &amp; Innovation
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Medical breakthroughs redefining patient care boundaries.
              </p>
            </motion.div>
          </div>

          {/* ── Desktop Horizontal Timeline ── */}
          <div className="hidden lg:block relative px-8 xl:px-12">
            <div className="relative grid grid-cols-5 grid-rows-[1fr_auto_1fr] items-center">
              {/* Track base */}
              <div className="absolute left-[10%] top-1/2 h-px w-[80%] -translate-y-1/2 bg-slate-200" />

              {/* Animated fill */}
              <motion.div
                className="absolute left-[10%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#4A0080] via-[#70529d] to-[#a78bda] shadow-[0_0_8px_2px_rgba(74,0,128,0.35)]"
                initial={{ width: "0%" }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 2.6, ease: "easeInOut" }}
              />

              {timelineItems.map((item, i) => {
                const delay = i * 0.35;

                // Compute arbitrary Tailwind style slots for grid position alignment
                const gridColClass = [
                  "col-start-1",
                  "col-start-2",
                  "col-start-3",
                  "col-start-4",
                  "col-start-5",
                ][i];

                return (
                  <React.Fragment key={i}>
                    {/* Row 1: Above Line */}
                    <div
                      className={`${gridColClass} row-start-1 self-end flex flex-col items-center`}
                    >
                      {item.above ? (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.8,
                              delay,
                              ease: "easeOut",
                            }}
                            className="w-[210px] h-[200px] bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#4A0080]/20 transition-all mb-6 flex flex-col shadow-lg"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3 shrink-0">
                              <item.icon className="h-4.5 w-4.5 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1.5 shrink-0">
                              {item.title}
                            </h4>
                            <p className="text-slate-500 text-xs leading-relaxed">
                              {item.desc}
                            </p>
                          </motion.div>

                          <motion.div
                            className="w-[2.5px] h-8 bg-slate-400 origin-bottom rounded-full"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.4, delay: delay + 0.3 }}
                          />
                        </>
                      ) : (
                        <div className="h-64" />
                      )}
                    </div>

                    {/* Row 2: Node Connection point */}
                    <div
                      className={`${gridColClass} row-start-2 flex justify-center`}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 16,
                          delay: delay + 0.15,
                        }}
                        className="w-11 h-11 rounded-full border-2 border-[#4A0080] bg-white flex items-center justify-center relative z-10 shadow-[0_0_0_4px_rgba(74,0,128,0.06)]"
                      >
                        <item.icon className="h-4 w-4 text-[#4A0080]" />
                      </motion.div>
                    </div>

                    {/* Row 3: Below Line */}
                    <div
                      className={`${gridColClass} row-start-3 self-start flex flex-col items-center`}
                    >
                      {!item.above ? (
                        <>
                          <motion.div
                            className="w-[2.5px] h-8 bg-slate-400 origin-top rounded-full"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.4,
                              delay: delay + 0.15,
                            }}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: -24, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.8,
                              delay: delay + 0.3,
                              ease: "easeOut",
                            }}
                            className="w-[210px] h-[200px] bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#4A0080]/20 transition-all mt-6 flex flex-col shadow-lg"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3 shrink-0">
                              <item.icon className="h-4.5 w-4.5 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1.5 shrink-0">
                              {item.title}
                            </h4>
                            <p className="text-slate-500 text-xs leading-relaxed">
                              {item.desc}
                            </p>
                          </motion.div>
                        </>
                      ) : (
                        <div className="h-64" />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* ── Mobile / Tablet Fallback (stacked) ── */}
          <div className="lg:hidden space-y-6">
            {[
              {
                icon: Bot,
                title: "Robotic Surgery",
                desc: "Utilizing Da Vinci Robotic Surgery systems for precise and minimally invasive operations.",
              },
              {
                icon: HeartPulse,
                title: "Advanced Oncology",
                desc: "Equipped with Tomotherapy and Gamma Knife technologies for targeted cancer treatment.",
              },
              {
                icon: Dna,
                title: "Genetic Diagnosis",
                desc: "State-of-the-art genetic labs for early diagnosis and Personalised medicine.",
              },
              {
                icon: Scan,
                title: "Diagnostic Imaging",
                desc: "Latest MRI (3 Tesla), PET-CT, and digital mammography systems.",
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                desc: "Strict adherence to JCI international safety and quality standards.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 flex items-start gap-3"
                style={{ boxShadow: "0px 25px 50px -12px #70529D" }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <card.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                    {card.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 7th Section: Popular Treatment Areas */}
        <div className="mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-[#115e6e]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#115e6e]">
                  Treatment Categories
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4A0080] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Popular Treatment Areas
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Discover our wide range of world-class healthcare services in
                Turkey.
              </p>
            </motion.div>
            <Link
              href="#"
              className="inline-flex items-center gap-1.5 text-[#115e6e] text-sm font-semibold hover:gap-2.5 transition-all shrink-0"
            >
              View All Treatments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Top Row: 2 Large Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6"
          >
            {/* Dental Treatment */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href="#"
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[20px] aspect-[16/11] block shadow-md"
              >
                <Image
                  src={DentalTreatment}
                  alt="Dental Treatment"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-end">
                  <h3
                    className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-1.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Dental Treatment
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm mb-2 sm:mb-3">
                    Implants, veneers, smile design and more
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs sm:text-sm font-semibold">
                      350+ clinics
                    </span>
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More{" "}
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Plastic Surgery */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href="#"
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[20px] aspect-[16/11] block shadow-md"
              >
                <Image
                  src={PlasticSurgery}
                  alt="Plastic Surgery"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-end">
                  <h3
                    className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-1.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Plastic Surgery
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm mb-2 sm:mb-3">
                    Rhinoplasty, liposuction, breast surgery, facelift
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs sm:text-sm font-semibold">
                      280+ clinics
                    </span>
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More{" "}
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Row: 3 Smaller Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Hair Transplant */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href="#"
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[20px] aspect-[4/5] block shadow-md"
              >
                <Image
                  src={HairTransplant}
                  alt="Hair Transplant"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-white text-sm sm:text-base font-bold mb-1">
                    Hair Transplant
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs font-semibold">
                      200+ clinics
                    </span>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More{" "}
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Cardiology */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href="#"
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[20px] aspect-[4/5] block shadow-md"
              >
                <Image
                  src={Cardiology}
                  alt="Cardiology"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-white text-sm sm:text-base font-bold mb-1">
                    Cardiology
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs font-semibold">
                      120+ clinics
                    </span>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More{" "}
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Eye Surgery */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href="#"
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[20px] aspect-[4/5] block shadow-md"
              >
                <Image
                  src={EyeSurgery}
                  alt="Eye Surgery"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-white text-sm sm:text-base font-bold mb-1">
                    Eye Surgery
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs font-semibold">
                      150+ clinics
                    </span>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More{" "}
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* --- TRANSLATION SERVICES SECTION --- */}
      <div className="bg-[#4A0080] text-white py-20  mt-12 ">
        {/* Header Block Section */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center mb-16">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-purple-200 border border-white/10 mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-xs uppercase font-bold tracking-widest font-sans">
              50+ LANGUAGES
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
            Medical Translation Services
          </h2>
          <p className="text-base md:text-lg text-purple-100/80 font-sans max-w-2xl leading-relaxed">
            Receive healthcare without language barriers. Professional
            interpreters by your side!
          </p>
        </div>

        {/* Dynamic Grid Mapping with Scroll-Driven Stagger Animation */}
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start pt-4 pb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {translationServices.map((service, index) => {
            const Icon = service.icon;
            const alignmentClass =
              index === 0
                ? "lg:translate-y-18"
                : index === 1
                  ? "lg:translate-y-0"
                  : index === 2
                    ? "lg:translate-y-16"
                    : "lg:translate-y-8";
            return (
              <motion.div
                key={service.id}
                className={`bg-white/10 border border-white/10 backdrop-blur-md rounded-[32px] p-8 flex flex-col justify-between min-h-[280px] shadow-lg relative group hover:bg-white/15 transition-all duration-300 ${alignmentClass}`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                    },
                  },
                }}
              >
                <div>
                  {/* Soft Translucent Container Frame for Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-purple-200 stroke-[2]" />
                  </div>

                  {/* Title & Description matching font rules */}
                  <h3 className="text-white font-serif font-bold text-xl mb-3 tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-purple-200/80 font-sans text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Minimal design bottom anchor line matching reference UI layout decoration */}
                <div className="w-8 h-[2px] bg-[#FFDEA54D]/20 rounded mt-6 group-hover:w-12 transition-all duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* --- RECREATED PIXEL-PERFECT "WHY TURKEY" GRID SECTION --- */}
      <div className="w-full  text-slate-900 mt-24">
        {/* Header Block Section */}
        <div className="mb-20 text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-[#1E6B65]"></span>
            <p className="text-[#1E6B65] tracking-widest text-xs font-bold uppercase">
              WHY TURKEY?
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#4A0080] font-serif tracking-tight">
            Choose Turkey for Medical Tourism
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            World-class healthcare services, affordable prices and exceptional
            hospitality in one of the world's most beautiful destinations.
          </p>
        </div>

        {/* Two-Column Grid Setup */}
        <div className="max-w-7xl mx-auto  grid grid-cols-1 lg:grid-cols-2  gap-12 justify-center items-center">
          {/* LEFT COLUMN: Hero Frame with Embedded Glassmorphic Stats */}
          <div className="relative w-full max-w-[540px] mx-auto aspect-[1/1.1] sm:aspect-[4/5] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden bg-slate-100 hover:scale-[1.02] transition-transform duration-500">
            {/* The Main Background Artwork */}
            <img
              src={
                typeof whyTurkeyBg === "string" ? whyTurkeyBg : whyTurkeyBg.src
              }
              alt="Why Turkey for Medical Tourism Showcase"
              className="absolute inset-0 w-full h-full scale-125 object-cover object-center transform transition-transform duration-500"
            />

            {/* Smooth Ambient Gradient Shading Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a27]/50 via-transparent to-transparent pointer-events-none" />

            {/* Top Left Branding Block */}
            <div className="absolute top-10 left-10 text-white z-10 pointer-events-none drop-shadow-sm">
              <h3 className="text-4xl font-serif font-bold tracking-wide text-white/95">
                TR
              </h3>
              <p className="text-xl font-serif font-medium mt-1 text-white/90">
                Turkey
              </p>
              <p className="text-xs font-inter tracking-widest text-white/70 font-light mt-0.5">
                Europe's Healthcare Hub
              </p>
            </div>

            {/* Bottom Floating Stats Grid Matrix */}
            <motion.div
              className="absolute bottom-8 inset-x-6 sm:inset-x-8 grid grid-cols-2 gap-3 sm:gap-4 z-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {[
                { value: 850, suffix: "+", sub: "ACCREDITED CLINICS" },
                { value: 45, suffix: "+", sub: "TREATMENT AREAS" },
                {
                  value: 1.5,
                  suffix: "M+",
                  sub: "YEARLY PATIENTS",
                  isFloat: true,
                }, // Custom handling if needed, or stick to integers
                { value: 70, suffix: "%", sub: "COST SAVINGS" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.75, y: 25 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 14,
                      },
                    },
                  }}
                  className="bg-white/15 border border-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col justify-center transition-all hover:bg-white/20"
                >
                  <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                    {stat.isFloat ? (
                      <span>1.5</span>
                    ) : (
                      <CountUp end={stat.value} duration={1800} />
                    )}
                    {stat.suffix}
                  </span>
                  <span className="text-[10px] tracking-widest font-bold text-white/70 mt-1 uppercase font-sans">
                    {stat.sub}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative w-full max-w-xl mx-auto h-[750px] select-none">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block"
              viewBox="0 0 500 750"
              fill="none"
            >
              <path
                d="M 100,50 Q 450,220 200,500 T 320,700"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeDasharray="6 8"
              />
            </svg>

            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="absolute flex flex-col items-center text-center group"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: "translate(-50%, -10%)",
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xl ring-[6px] ring-white group-hover:shadow-[0_12px_24px_rgba(30,107,101,0.15)] transition-all duration-300 z-10 cursor-pointer">
                    <Icon className="w-5 h-5 text-[#1E6B65] stroke-[2.2]" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-[#132A36] font-serif font-bold text-sm md:text-base">
                      {item.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- STRATEGIC GLOBAL PRESENCE: POPULAR CITIES SECTION --- */}
      <div className="w-full  flex flex-col items-center justify-center mt-24">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[2px] bg-teal-600"></span>
            <p className="text-teal-700 tracking-widest text-xs font-semibold uppercase">
              Strategic Global Presence
            </p>
          </div>
          <h2 className="text-[#4A0080] text-4xl md:text-5xl mt-3 font-bold font-serif">
            Popular Cities
          </h2>
        </div>

        <div className="max-w-6xl w-full mx-auto ">
          <div className="relative w-full flex items-center justify-center min-h-[600px]">
            <div
              className="absolute inset-0 pointer-events-none bg-no-repeat bg-contain bg-center"
              style={{ backgroundImage: `url(${TurkeyBg.src})` }}
            />

            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  className="absolute flex flex-col items-center pointer-events-auto group"
                  style={{ top: city.position.top, left: city.position.left }}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.15,
                  }}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-teal-600 shadow-md ring-4 ring-teal-600/20 mb-2 transform group-hover:scale-110 transition-transform" />
                  <div className="bg-purple-200/90 border border-purple-300/40 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg min-w-[130px] text-center transform hover:-translate-y-1 transition-transform duration-200">
                    <p className="text-[#00464F] font-serif font-bold text-base md:text-lg">
                      {city.name}
                    </p>
                    <p className="font-sans text-xs md:text-sm font-medium mt-0.5 whitespace-nowrap text-slate-700">
                      <CountUp end={city.clinicsCount} />+ Clinics
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- DYNAMIC PROCESS EXPERIENCE AREA ("How it works?") --- */}
      {/* <div className="bg-[#0A0C10] text-white min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-16 text-center"
        >
          <div className="text-center text-white inline-block px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#4A0080]">
            <h2 className="text-xs sm:text-sm uppercase tracking-wider font-sans font-semibold">
              THE EXPERIENCE
            </h2>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 font-serif">
            How it works?
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            A seamless journey from your first inquiry to world-class recovery.
          </p>
        </motion.div>

        <div className="w-full mt-8 sm:mt-12 flex items-center justify-center pb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 items-start"
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const alignmentClass =
                index === 0
                  ? "lg:translate-y-12"
                  : index === 1
                    ? "lg:translate-y-0"
                    : index === 2
                      ? "lg:translate-y-16"
                      : "lg:translate-y-8";

              return (
                <motion.div
                  key={step.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                  className={`flex flex-col items-center text-center transition-transform duration-300 ${alignmentClass}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-purple-500/30 bg-[#161224] text-gray-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] mb-4 sm:mb-6"
                  >
                    <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5]" />
                  </motion.div>

                  <div className="w-full bg-[#4a0080] border border-purple-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[160px] sm:min-h-[180px] flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-white text-lg sm:text-2xl font-serif font-medium mb-2 sm:mb-3 tracking-wide">
                      {step.title}
                    </h3>
                    <p className="text-purple-200/80 text-xs sm:text-sm font-sans leading-relaxed max-w-[220px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div> */}
      <Footer />
    </section>
  );
}
