"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Star } from "lucide-react";

const detoxHospitals = [
    {
        slug: "buchinger-wilhelmi",
        location: "Germany • Spain",
        name: "Buchinger Wilhelmi",
        description:
            "A world-renowned medical clinic for therapeutic fasting, integrative medicine, and inspiration. Experience the synthesis of traditional fasting with modern medical science in a setting of unparalleled tranquility.",
        rating: 5,
        image: "/images/hospitals/ayurvedic/buchinger-wilhelmi.png",
    },
];

export default function Detox() {
    return (
        <section id="detox" className="bg-white text-slate-900 py-20 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl text-left mb-12"
                >
                    <h2
                        className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4A0080] mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Detox Hospitals
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        Explore our curated selection of world-class detox destinations, where evidence-based wellness meets transformative healing. Each institution is dedicated to restoring balance, vitality, and long-term wellbeing through Personalised detox programs.
                    </p>
                </motion.div>

                {/* Hospital Cards */}
                <div className="space-y-8">
                    {detoxHospitals.map((hospital, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="flex flex-col sm:flex-row-reverse bg-white rounded-[24px] overflow-hidden border border-slate-100"
                            style={{ boxShadow: "0px 25px 50px -12px #70529D" }}
                        >
                            {/* Right: Content */}
                            <div className="sm:w-[42%] p-8 sm:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <MapPin className="h-3.5 w-3.5 text-[#4A0080]" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A0080]">
                                            {hospital.location}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-xl sm:text-2xl font-bold text-[#0B1C30] mb-3"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {hospital.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {hospital.description}
                                    </p>
                                </div>

                                <div className="border-t border-slate-100 mt-6 pt-5 flex items-center justify-between">
                                    <Link
                                        href={`/hospitals/Detoxnew?slug=${hospital.slug}`}
                                        className="inline-flex items-center gap-1.5 text-[#4A0080] text-sm font-semibold hover:gap-2.5 transition-all"
                                    >
                                        View Details
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: hospital.rating }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-[#4A0080] text-[#4A0080]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Left: Image */}
                            <div className="sm:w-[58%] relative min-h-[260px] sm:min-h-[320px]">
                                <Image
                                    src={hospital.image}
                                    alt={hospital.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}