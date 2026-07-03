"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Leader {
  name: string;
  title: string;
  bio: string;
  image: string;
  mobileImage: string;
}

const leaders: Leader[] = [
  {
    name: "Sethu Vaidyanathan",
    title: "Co Founder",
    bio: "Sethu Vaidyanathan is a serial entrepreneur, investor, philanthropist, and third-generation business leader with decades of experience in the corporate world \n Throughout his career, he has invested in and funded numerous successful start-ups across India and international markets, helping entrepreneurs transform innovative ideas into scalable businesses He serves as a Mentor at *Zone by The Park*, a hospitality brand of the [Apeejay Surrendra Group] and is an advisor and board member to more than 20 companies \n spanning multiple industries.With his family maintaining a business presence in the United Kingdom for over six decades, Sethu brings a unique global perspective to entrepreneurship, strategic investments, and business growth Beyond business, Sethu is deeply committed to philanthropy \n He actively supports initiatives focused on human rights, animal welfare, climate action, and serves as a patron of arts and sports. His dedication to creating meaningful social impact is as significant  as his entrepreneurial achievements \n An accomplished author of four books, Sethu is also an avid art collector with a passion for culture, creativity, and global travel.He divides his time between London, New York, and Delhi, and enjoys travelling with his wife, Priya, and their son, Vir.",
    image: "/images/Sethu.png",
    mobileImage: "/images/Sethu-mb.png",
  },
  {
    name: "Ramesh Mahalingam",
    title: "Founder & CTO",
    bio: `Ramesh Mahalingam is the Co-Founder and Chief Technology Officer of Nova Cura Global, where he leads the company's product vision, technology strategy, and engineering excellence \n A lifelong technologist and innovator, Ramesh has been the driving force behind building a platform trusted and used by millions of users across the globe. Ramesh has cultivated a high-performing team of creative problem-solvers dedicated to tackling some of the most complex challenges in the medical tourism industry. As a Co-Founder, Ramesh has played a pivotal role in shaping Nova Cura Global's growth trajectory, including spearheading the expansion of innovative service offerings such as Ayurvedic, Wellness and Detox programmes \n Alongside co-founders Sethu and Hardy, he has been instrumental in transforming a bold vision into a globally recognised platform that leverages technology to improve access to medical tourism and enhance patient outcomes \n Ramesh is currently focused on accelerating Nova Cura Global's core business growth and expansion across the United Kingdom, bringing world-class healthcare experiences within reach for more people than ever before.`,
    image: "/images/Rameshleader.jpeg",
    mobileImage: "/images/Rameshleader-mb.jpeg",
  },

  {
    name: "Hardy Gakhal",
    title: "Co-Founder",
    bio: `Hardy Gakhal, Co-Founder, is a distinguished professional in the plastics industry, recognised for his innovative contributions to developing NIR-detectable products, enhancing sustainability and efficiency. As the owner of Varna Investments, he also brings a wealth of expertise in global financing, making significant impacts across both fields. His multifaceted experience positions him as a leading figure in driving industry advancements and sustainable solutions.`,
    image: "/images/Hardyleader.jpeg",
    mobileImage: "/images/Hardyleader-mb.jpeg",
  },
  {
    name: "Dr. Vijaybabu Kaliappan",
    title: "COO",
    bio: `Dr. Vijaybabu Kaliappan MBBS MD, COO, Professor of Medicine — 21 years of medical academics, presently Dean of Research in Zydus Foundation. Developed drugs for covid, anaemia, now working on sickle cell disease eradication at PM Narendra Modi's Visionary programme. Developed cough sound based diagnostics for various viral lung diseases including covid for Australian corporate.`,
    image: "/images/Vijayleader.jpeg",
    mobileImage: "/images/Vijayleader-mb.jpeg",
  },
];

const LeadersPage = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState<number | null>(null);

  return (
    <div className="text-white py-8 overflow-hidden">
      {/* ===================== DESKTOP  VIEW ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="hidden md:flex max-w-7xl mx-auto flex-row gap-2 md:gap-4 p-3 md:p-0 h-[700px]"
      >
        {leaders.map((leader, index) => {
          const isActive = activeIdx === index;

          return (
            <motion.div
              key={index}
              layout
              animate={{ flex: isActive ? "4 1 0%" : "1 1 0%" }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer h-full shadow-md"
              style={{
                minWidth: isActive ? "0" : "180px",
                border: isActive
                  ? "1.5px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
              onClick={() => setActiveIdx(index)}
              onMouseEnter={() => setActiveIdx(index)}
            >
              {/* Image Layer */}
              <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-transform duration-500"
                style={{
                  backgroundImage: `url(${leader.image})`,
                  filter: isActive
                    ? "brightness(1.15) saturate(1.5)"
                    : "brightness(0.55) saturate(0.9)",
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                  transition: "filter 0.65s ease, transform 0.85s ease",
                }}
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.55) 60%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.75) 80%)",
                }}
              />

              {/* Collapsed vertical name */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-end justify-center pb-8"
                  >
                    <span
                      className="text-white/60 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {leader.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={`content-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 select-none overflow-y-auto"
                  >
                    <div className="mt-auto">
                      <motion.p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1.5 text-white/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        {leader.title}
                      </motion.p>

                      <motion.h3
                        className="text-2xl md:text-3xl font-bold text-purple-600 leading-tight mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                      >
                        {leader.name}
                      </motion.h3>

                      <motion.div
                        className="space-y-4 mb-5 max-w-2xl"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                      >
                        {leader.bio.split("\n").map((paragraph, idx) => (
                          <p
                            key={idx}
                            className="text-gray-200 text-sm md:text-base leading-7"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ===================== MOBILE VIEW (vertical accordion) ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex md:hidden flex-col gap-4 max-w-md mx-auto p-2"
      >
        {leaders.map((leader, index) => {
          const isActive = mobileActiveIdx === index;

          return (
            <motion.div
              key={index}
              layout
              className="relative rounded-2xl overflow-hidden shadow-md bg-black/20"
            >
              {/* Tappable image header — always visible */}
              <button
                type="button"
                onClick={() =>
                  setMobileActiveIdx((prev) => (prev === index ? null : index))
                }
                className="relative w-full text-left"
                style={{
                  height: isActive ? "260px" : "200px",
                  transition: "height 0.45s ease",
                }}
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${leader.mobileImage || leader.image})`,
                    filter: isActive
                      ? "brightness(1.1) saturate(1.4)"
                      : "brightness(0.6) saturate(0.9)",
                    transition: "filter 0.5s ease",
                  }}
                />

                {/* Gradient overlay for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 90%)",
                  }}
                />

                {/* Name / title / chevron */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <div className="min-w-0 pr-3">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/70 mb-1">
                      {leader.title}
                    </p>
                    <h3 className="text-lg font-bold text-purple-400 leading-snug truncate">
                      {leader.name}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 rounded-full bg-white/10 p-1.5 mb-0.5"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </button>

              {/* Expandable bio section */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key={`mobile-content-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden bg-black/40"
                  >
                    <div className="p-4  space-y-3 max-h-[340px] overflow-y-auto">
                      {leader.bio.split("\n").map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-gray-200 text-[13px] leading-6"
                        >
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LeadersPage;