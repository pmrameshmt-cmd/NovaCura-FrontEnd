"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import {
  Phone,
  Play,
  Shield,
  Globe,
  UserRound,
  Lock,
  Headset,
} from "lucide-react";
import heroImage from "@/public/images/hero/hero-image.jpg";

export default function Hero() {
  const heroImage = PlaceHolderImages?.find((p) => p.id === "hero-background");

  const services = [
    {
      title: "AYURVEDIC HOSPITALS",
      description:
        "Authentic Ayurvedic treatments and therapies for natural healing and long-term wellness.",
    },
    {
      title: "DETOX HOSPITALS",
      description:
        "Advanced detox programs to cleanse, rejuvenate and restore your body & mind.",
    },
    {
      title: "MEDICAL CARE",
      description:
        "Access to world-class medical treatment across specialities with trusted experts.",
    },
    {
      title: "WELLNESS & PREVENTIVE CARE",
      description:
        "Preventive health checkups, wellness programs and lifestyle management.",
    },
    {
      title: "REHABILITATION & RECOVERY",
      description:
        "Personalised rehabilitation programs for faster recovery and improved quality of life.",
    },
  ];

  const trustItems = [
    {
      icon: Shield,
      label: "Trusted Healthcare Partners",
      
    },
    {
      icon: Globe,
      label: "Worldwide Network of Hospitals",
    },
    {
      icon: UserRound,
      label: "Personalised Care Every Step",
    },
    {
      icon: Lock,
      label: "Privacy & Comfort Assured",
    },
    {
      icon: Headset,
      label: "24/7 Care Support",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      {heroImage && (
        <Image
          src="/images/novacura.png"
          alt=""
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

      <div className="relative z-10  mx-auto px-4 lg:px-8">
        {/* Main Hero */}
        <div className="flex min-h-[72vh] items-center ">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-bold leading-tight md:text-7xl"
            >
              Elevating Health
              <br />
              Through <span className="text-accent">Wellness</span>
            </motion.h1>

            <div className="my-8 h-px w-full max-w-xl bg-white/20" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-lg font-medium md:text-2xl"
            >
              <span>Ayurvedic Care</span>
              <span className="text-accent">•</span>
              <span>Detox Programs</span>
              <span className="text-accent">•</span>
              <span>Medical Excellence</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 max-w-3xl text-md leading-relaxed text-white/85 md:text-xl"
            >
              Discover a seamless blend of traditional healing and modern
              medicine. Our Specialised centres offer holistic wellness,
              detoxification, preventive healthcare, and Personalised treatment
              programs designed to restore balance and vitality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              {/* <Button size="lg" className="h-14 px-8 text-base font-semibold">
                Explore Our Services
              </Button> */}

              {/* <Button
                size="lg"
                variant="outline"
                className="h-14 border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Our Video
              </Button> */}
            </motion.div>
          </div>
        </div>

        {/* Service Cards */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="-mt-10 grid gap-4 lg:grid-cols-5"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-white/10 bg-white/95 p-6 text-black shadow-2xl backdrop-blur"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
                <div className="h-6 w-6 rounded-full bg-accent" />
              </div>

              <h3 className="mb-3 text-lg font-bold">
                {service.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </motion.div> */}

        {/* Trust Strip */}
        <div className="mt-6 mb-10 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="grid gap-3 p-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-white/90"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
