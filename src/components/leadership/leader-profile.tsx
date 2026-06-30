'use client';

import React from 'react';
import Image from 'next/image';


export default function LeaderProfile() {
    return (
        <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-16">
            <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-16">
                
                {/* Image Section */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto md:max-w-md rounded-3xl overflow-hidden [box-shadow:0_10px_40px_-10px_rgba(37,99,235,0.08)] bg-[#eff4ff]">
                        {/* Soft visual placeholder framework if image fails */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#434655]/60 bg-[#e5eeff] p-6 text-center text-sm font-medium">
                            <span>
                                Place image asset at:<br />
                                <code className="bg-white/50 px-1.5 py-0.5 rounded mt-1 inline-block text-xs text-[#004ac6]">/public/images/Sethu.png</code>
                            </span>
                        </div>
                        <Image
                            src="/images/Sethu.png"
                            alt="Sethu Vaidyanathan - Executive Portrait"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                            className="object-cover object-top transition-transform duration-500 hover:scale-102"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-2/3 flex flex-col text-left justify-center md:pt-4">
                    <span className="text-[#004ac6] text-xs font-semibold tracking-widest uppercase mb-3 block">
                        Board of Trustees
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-[#0b1c30]">
                        Sethu Vaidyanathan
                    </h2>
                    <h3 className="text-lg md:text-xl font-semibold text-[#005a82] uppercase tracking-wide mb-8">
                        Venture Capitalist & Entrepreneur
                    </h3>
                    
                    <hr className="border-[#c3c6d7]/30 mb-6 w-16" />

                    <p className="text-[#434655] text-base md:text-lg leading-relaxed mb-8 font-normal">
                        Sethu Vaidyanathan is a prominent Indian entrepreneur, investor, and philanthropist with over three decades of experience in business leadership and venture development. An alumnus of both IIM Ahmedabad and the National Law School of India University, Bangalore, he has utilized his extensive academic background to serve in various leadership and board roles across diverse enterprises, consistently supporting growth-oriented and sustainability-driven ventures. 
                    </p>
                    <p className="text-[#434655] text-base md:text-lg leading-relaxed mb-8 font-normal">
                        Beyond his corporate pursuits, he is a dedicated advocate for animal welfare and ethical living, actively championing causes rooted in compassion and environmental responsibility. Additionally, as a trustee of the Chennai Photo Biennale Foundation, he plays a pivotal role in advancing contemporary art and visual culture in India, seamlessly blending his business acumen with a deep commitment to social and cultural progress.
                    </p>

                    {/* Contact / Networking Section */}
                    <div className="flex items-center gap-3 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl p-4 self-start max-w-full">
                        <div className="bg-[#2563eb] text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0 truncate pr-2">
                            <span className="text-[11px] font-bold tracking-wider text-[#434655] uppercase">Professional Profile</span>
                            <a
                                href="https://www.linkedin.com/in/sethu-vaidyanathan-89281763"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-[#004ac6] hover:text-[#003ea8] underline transition-colors truncate"
                            >
                                linkedin.com/in/sethu-vaidyanathan
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}