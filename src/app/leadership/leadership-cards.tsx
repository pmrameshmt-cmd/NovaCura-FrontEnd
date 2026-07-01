"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Leader {
  name: string;
  title: string;
  bio: string;
  image: string;
  
}

const leaders: Leader[] = [
  {
    name: "Sethu Vaidyanathan",
    title: "Co Founder",
    bio: "A prominent Indian entrepreneur, investor, and philanthropist with over three decades of experience in business leadership and venture development \n An alumnus of both IIM Ahmedabad and the National Law School of India University, Bangalore, he has utilized his extensive academic background to serve in various leadership and board roles across diverse enterprises, consistently supporting growth-oriented and sustainability-driven ventures \n Beyond his corporate pursuits, he is a dedicated advocate for animal welfare and ethical living, actively championing causes rooted in compassion and environmental responsibility \n Additionally, as a trustee of the Chennai Photo Biennale Foundation, he plays a pivotal role in advancing contemporary art and visual culture in India, seamlessly blending his business acumen with a deep commitment to social and cultural progress.",
    image: "/images/Sethu.png",
  },
  {
    name: "Ramesh Mahalingam",
    title: "Founder & CTO",
    bio: `Ramesh Mahalingam is the Co-Founder and Chief Technology Officer of Nova Cura Global, where he leads the company's product vision, technology strategy, and engineering excellence \n A lifelong technologist and innovator, Ramesh has been the driving force behind building a platform trusted and used by millions of users across the globe.Ramesh has cultivated a high-performing team of creative problem-solvers dedicated to tackling some of the most complex challenges in the medical tourism industry.As a Co-Founder, Ramesh has played a pivotal role in shaping Nova Cura Global's growth trajectory, including spearheading the expansion of innovative service offerings such as Ayurvedic, Wellness and Detox programmes \n Alongside co-founders Sethu and Hardy, he has been instrumental in transforming a bold vision into a globally recognised platform that leverages technology to improve access to medical tourism and enhance patient outcomes \n Ramesh is currently focused on accelerating Nova Cura Global's core business growth and expansion across the United Kingdom, bringing world-class healthcare experiences within reach for more people than ever before.`,
    image: "/images/Rameshleader.jpeg",
    
  },
  {
    name: "Hardy Gakhal",
    title: "Co-Founder",
    bio: `Hardy Gakhal, Co-Founder, is a distinguished professional in the plastics industry, recognised for his innovative contributions to developing NIR-detectable products, enhancing sustainability and efficiency. As the owner of Varna Investments, he also brings a wealth of expertise in global financing, making significant impacts across both fields. His multifaceted experience positions him as a leading figure in driving industry advancements and sustainable solutions.`,
    image: "/images/Hardyleader.jpeg",
    
  },
  {
    name: "Dr. Vijaybabu Kaliappan",
    title: "COO",
    bio: `Dr. Vijaybabu Kaliappan MBBS MD, COO, Professor of Medicine — 21 years of medical academics, presently Dean of Research in Zydus Foundation. Developed drugs for covid, anaemia, now working on sickle cell disease eradication at PM Narendra Modi's Visionary programme. Developed cough sound based diagnostics for various viral lung diseases including covid for Australian corporate.`,
    image: "/images/Vijayleader.jpeg",
    
  },
];

const LeadersPage = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="text-white py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="max-w-7xl mx-auto flex flex-row gap-2 md:gap-4 p-3 md:p-0 h-[700px]"
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

              {/* Top accent bar — white */}
              {/* Purple top border */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[5px] rounded-t-2xl"
                    style={{
                      background:
                        "linear-gradient(90deg, #8B5CF6, #A855F7, #C084FC)",
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

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
                    // No justify-end — content starts from top of bottom area
                    // overflow-y-auto so ALL text is accessible by scrolling
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 select-none overflow-y-auto"
                  >
                    {/* Spacer pushes content down initially but allows scroll up */}
                    <div className="mt-auto">
                      {/* Title */}
                      <motion.p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1.5 text-white/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        {leader.title}
                      </motion.p>

                      {/* Name */}
                      <motion.h3
                        className="text-2xl md:text-3xl font-bold text-purple-600 leading-tight mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                      >
                        {leader.name}
                      </motion.h3>

                      {/* Bio — ALL lines shown, no clamp, no scroll cutoff */}
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
    </div>
  );
};

export default LeadersPage;

// "use client";

// import React, { useState } from "react";
// import Image from "next/image";

// interface Leader {
//   name: string;
//   title: string;
//   bio: string;
//   image: string;
//   linkedin?: string;
//   twitter?: string;
// }

// const leaders: Leader[] = [
//   {
//     name: "Sethu Vaidyanathan",
//     title: "Venture Capitalist & Entrepreneur",
//     bio: "A prominent Indian entrepreneur, investor, and philanthropist with over three decades of experience in business leadership and venture development. An alumnus of both IIM Ahmedabad and the National Law School of India University, Bangalore, he has utilized his extensive academic background to serve in various leadership and board roles across diverse enterprises, consistently supporting growth-oriented and sustainability-driven ventures. Beyond his corporate pursuits, he is a dedicated advocate for animal welfare and ethical living, actively championing causes rooted in compassion and environmental responsibility. Additionally, as a trustee of the Chennai Photo Biennale Foundation, he plays a pivotal role in advancing contemporary art and visual culture in India, seamlessly blending his business acumen with a deep commitment to social and cultural progress.",
//     image: "/images/Sethu.png",
//     linkedin: "https://www.linkedin.com/in/sethu-vaidyanathan-89281763",
//     twitter: "https://twitter.com/sethuvaidya",
//   },
//   {
//     name: "Ramesh Mahalingam",
//     title: "Co-Founder & CTO, Nova Cura Global",
//     bio: "Ramesh Mahalingam is the Co-Founder and Chief Technology Officer of Nova Cura Global, where he leads the company's product vision, technology strategy, and engineering excellence. A lifelong technologist and innovator, Ramesh has been the driving force behind building a platform trusted and used by millions of users across the globe.Ramesh has cultivated a high-performing team of creative problem-solvers dedicated to tackling some of the most complex challenges in the medical tourism industry.As a Co-Founder, Ramesh has played a pivotal role in shaping Nova Cura Global's growth trajectory, including spearheading the expansion of innovative service offerings such as Ayurvedic, Wellness and Detox programmes. Alongside co-founders Sethu and Hardy, he has been instrumental in transforming a bold vision into a globally recognised platform that leverages technology to improve access to medical tourism and enhance patient outcomes.Ramesh is currently focused on accelerating Nova Cura Global's core business growth and expansion across the United Kingdom, bringing world-class healthcare experiences within reach for more people than ever before.",
//     image: "/images/Rameshleader.jpeg",
//     linkedin: "https://www.linkedin.com/in/julian-sterling",
//     twitter: "https://twitter.com/juliansterling",
//   },
//   {
//     name: "Hardy Gakhal",
//     title: "Co-Founder",
//     bio: "Hardy Gakhal, Co-Founder, is a distinguished professional in the plastics industry, recognised for his innovative contributions to developing NIR-detectable products, enhancing sustainability and efficiency. As the owner of Varna Investments, he also brings a wealth of expertise in global financing, making significant impacts across both fields. His multifaceted experience positions him as a leading figure in driving industry advancements and sustainable solutions.",
//     image: "/images/Hardyleader.jpeg",
//     linkedin: "https://www.linkedin.com/in/marcus-thorne",
//     twitter: "https://twitter.com/marcusthorne",
//   },
//   {
//     name: "Dr. Vijaybabu Kaliappan",
//     title: "MBBS MD, COO, Professor of Medicine",
//     bio: "Dr. Vijaybabu Kaliappan MBBS MD, COO, Professor of Medicine — 21 years of medical academics, presently Dean of Research in Zydus Foundation. Developed drugs for covid, anaemia, now working on sickle cell disease eradication at PM Narendra Modi's Visionary programme. Developed cough sound based diagnostics for various viral lung diseases including covid for Australian corporate.",
//     image: "/images/Vijayleader.jpeg",
//     linkedin: "https://www.linkedin.com/in/marcus-thorne",
//     twitter: "https://twitter.com/marcusthorne",
//   },
// ];

// export default function LeadershipCards() {
//   const [current, setCurrent] = useState(0);
//   const [fading, setFading] = useState(false);
//   const activeLeader = leaders[current];

//   const handleSwitch = (index: number) => {
//     if (index === current) return;
//     setFading(true);
//     setTimeout(() => {
//       setCurrent(index);
//       setFading(false);
//     }, 400);
//   };

//   return (
//     <section className="w-full min-h-screen flex flex-col justify-center pt-15 pb-24 bg-[#fdf8f8]">
//       <style>{`
//         .portrait-active {
//           filter: grayscale(0%) opacity(100%);
//           transform: scale(1.05);
//         }
//         .portrait-inactive {
//           filter: grayscale(100%) opacity(60%);
//           transform: scale(1);
//         }
//         .portrait-transition {
//           transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//         }
//         .bio-visible {
//           opacity: 1;
//           transform: translateX(0);
//           transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
//         }
//         .bio-hidden {
//           opacity: 0;
//           transform: translateX(16px);
//           transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

//         {/* Left Side: Portrait Grid */}
//         <div className="md:col-span-6 grid grid-cols-2 gap-6 relative h-[700px]">
//           {leaders.map((leader, i) => {
//             const positions = [
//               "self-end",
//               "self-start mt-10",
//               "self-start",
//               "self-end mb-10",
//             ];

//             let curveClasses = "";
//             if (i === 0) {
//               // Image 1: Top-Right / Bottom-Left Curves
//               curveClasses = "rounded-tr-[5.5rem] rounded-bl-[5.5rem] rounded-tl-2xl rounded-br-2xl";
//             } else if (i === 1) {
//               // Image 2: Top-Left / Bottom-Right Curves
//               curveClasses = "rounded-tl-[5.5rem] rounded-br-[5.5rem] rounded-tr-2xl rounded-bl-2xl";
//             } else if (i === 2) {
//               // Image 3: Opposite of Image 1 -> Top-Left / Bottom-Right Curves
//               curveClasses = "rounded-tl-[5.5rem] rounded-br-[5.5rem] rounded-tr-2xl rounded-bl-2xl";
//             } else if (i === 3) {
//               // Image 4: Opposite of Image 2 -> Top-Right / Bottom-Left Curves
//               curveClasses = "rounded-tr-[5.5rem] rounded-bl-[5.5rem] rounded-tl-2xl rounded-br-2xl";
//             }

//             return (
//               <div
//                 key={leader.name}
//                 className={`relative group cursor-pointer h-[340px] ${positions[i]}`}
//                 onClick={() => handleSwitch(i)}
//               >
//                 <div
//                   className={`portrait-transition w-full h-full overflow-hidden ${curveClasses} ${
//                     current === i ? "portrait-active" : "portrait-inactive"
//                   }`}
//                 >
//                   <Image
//                     src={leader.image}
//                     alt={leader.name}
//                     fill
//                     className="object-cover object-top"
//                     sizes="(max-width: 768px) 45vw, 25vw"
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Right Side: Bio Info Panel */}
//         <div className="lg:col-span-6 flex flex-col justify-center">
//           <div className={current !== -1 && !fading ? "bio-visible" : "bio-hidden"}>

//             <h1 className="font-serif text-2xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2">
//               {activeLeader.name}
//             </h1>

//             <h2 className="font-serif text-1xl italic text-slate-500 mb-4 border-slate-200 pb-1">
//               {activeLeader.title}
//             </h2>

//             <div className="text-slate-700 text-md leading-relaxed font-light max-w-xl mb-10 space-y-4">
//               {activeLeader.bio.split("\n\n").map((para, idx) => (
//                 <p key={idx}>{para}</p>
//               ))}
//             </div>

//             <div className="flex gap-3">
//               {activeLeader.linkedin && (
//                 <a
//                   href={activeLeader.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-slate-900 border-b border-slate-900 pb-1 hover:border-transparent transition-all group"
//                 >
//                   Connect on LinkedIn
//                   <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
//                   </svg>
//                 </a>
//               )}
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }
