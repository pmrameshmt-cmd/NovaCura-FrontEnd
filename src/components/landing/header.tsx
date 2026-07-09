"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Stethoscope,
  Info,
  Briefcase,
  Building2,
  HelpCircle,
  PhoneCall,
  ChevronDown,
} from "lucide-react";

interface MobileAccordionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function MobileAccordion({
  title,
  icon: Icon,
  children,
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full flex items-center justify-between px-4 py-3 mt-3 text-left text-[16px] rounded-xl font-semibold text-white bg-transparent outline-none transition-all duration-200 shadow-xl border border-white/20 hover:bg-white hover:text-purple-900 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 group-hover:bg-purple-100 rounded-full p-[6px] border border-white/20 group-hover:border-purple-200 shrink-0 flex items-center justify-center transition-colors duration-200">
            <Icon className="h-4 w-4 text-[#dc94ff] group-hover:text-purple-900 transition-colors duration-200" />
          </div>
          <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-white/70 group-hover:text-purple-900 transition-all duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="bg-black/20 border border-white/10 mx-0.5 mb-1 mt-1 rounded-xl shadow-[inset_0_2px_16px_rgba(0,0,0,0.20)] py-2 px-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  {
    href: "/who-we-are",
    label: "About Us",
    icon: Info,
    subItems: [
      { href: "/who-we-are", label: "Who We Are" },
      { href: "/mission-vision", label: "Mission & Vision" },
      { href: "/how-it-works", label: "How NOVACURA GLOBAL Works" },
      { href: "/why-novacura-global", label: "Why Choose NOVACURA GLOBAL" },
      { href: "/impact", label: "Our Impact" },
      { href: "/leadership", label: "Leadership" },
      { href: "/values", label: "Values" },
    ],
  },
  { href: "#services", label: "Services", icon: Briefcase },
  { href: "#hospitals", label: "Hospitals", icon: Building2 },
  { href: "#how-it-works", label: "How It Works", icon: HelpCircle },
  { href: "#contact", label: "Contact", icon: PhoneCall },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      if (isHome) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {/* Spacer div so fixed header doesn't cover page content.
          Height matches the header's largest state (h-20 = 5rem). */}
      <div className="h-15 sm:h-15" aria-hidden="true" />

      <div
        className={`fixed inset-y-0 right-0 z-[9999] w-full max-w-[24rem] h-screen transition-all duration-300 ease-out p-4 rounded-l-[2rem] bg-purple-900 border border-white/20 shadow-[0_12px_64px_-8px_rgba(74,0,128,0.80)] overflow-hidden ${
          open
            ? "translate-x-0 opacity-100 visible pointer-events-auto"
            : "translate-x-full opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full w-full justify-between relative z-[2]">
          <div className="flex items-center justify-between px-2 pb-3 pt-1 shrink-0">
            <div></div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-2xl font-light transition-all rounded-full text-[rgba(220,180,255,0.90)] bg-white/10 border border-white/20 leading-none hover:text-white hover:bg-white/20"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-1 pb-6">
              {navLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <div key={link.label} className="w-full">
                    {link.subItems ? (
                      <MobileAccordion title={link.label} icon={LinkIcon}>
                        {link.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 pl-6 text-[15px] font-medium rounded-xl text-white border-l-2 border-l-transparent transition-all duration-200 hover:bg-white hover:text-purple-900 hover:pl-8"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </MobileAccordion>
                    ) : (
                      <button
                        onClick={(e) => handleNavigation(e, link.href)}
                        className="group w-full flex items-center gap-3 px-4 py-3 text-left text-[16px] rounded-xl mt-3 shadow-xl border border-white/20 font-semibold text-white bg-transparent outline-none transition-all duration-200 hover:bg-white hover:text-purple-900"
                      >
                        <div className="bg-white/10 group-hover:bg-purple-100 rounded-full p-[6px] border border-white/20 group-hover:border-purple-200 shrink-0 flex items-center justify-center transition-colors duration-200">
                          <LinkIcon className="h-4 w-4 text-white group-hover:text-purple-900 transition-colors duration-200" />
                        </div>
                        <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-colors duration-200">
                          {link.label}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 pb-1 px-1 shrink-0">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/sign-in");
              }}
              className="w-full h-11 rounded-full text-sm font-bold tracking-wide transition-all duration-200 text-[#4a0080] bg-gradient-to-br from-[#ffffff] via-[#eedeff] to-[#e0c8ff] border border-white/60 shadow-[0_4px_28px_rgba(74,0,128,0.55)] hover:from-[#f5e4ff]"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>

      <header
        className={`
          fixed top-0 left-0 z-50 w-full
          backdrop-blur-3xl
          backdrop-saturate-[220%]
          backdrop-brightness-[1.12]
          transition-all duration-[300ms] ease-in-out
          bg-white md:bg-[linear-gradient(to_right,_#ffffff_0%,_#ffffff_25%,_#ddd6f8_35%,_#bfaced_45%,_#a382e1_55%,_#8a57d1_65%,_#7940bf_75%,_#6827ae_82%,_#57019c_88%,_#4a0187_93%,_#3d0173_96%,_#310060_98%,_#25004d_100%)]
        `}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent via-[rgba(160,80,255,0.08)] to-white/10 pointer-events-none z-0"
        />
        <div className="w-full pl-0 pr-3 sm:pl-4 sm:pr-10 lg:pl-4 lg:pr-10 relative z-[2]">
          <div
            className="flex items-center justify-between w-full transition-all duration-[300ms]"
          >
            <Link
              href="/"
              className="flex items-center  select-none -ml-10"
            >
              <img
                src="/images/Nova%20Cura%20Global%20Logo.png"
                alt="NovaCura Global Logo"
                className="h-16 w-40 object-contain transition-all duration-[300ms] "
              />
              <p className="text-[10px] sm:text-[18px] font-bold text-[#42AED2] -ml-8 tracking-wide ">
                NOVACURA GLOBAL
              </p>
            </Link>

            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/sign-in">
                <button className="text-xs sm:text-sm font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 text-black bg-white border border-slate-200 shadow-sm tracking-wide sm:tracking-wide hover:bg-slate-50 whitespace-nowrap md:text-white md:bg-white/10 md:border-white/20 md:hover:bg-white/20 md:hover:text-white">
                  Sign In
                </button>
              </Link>

              <Link href="/sign-up">
                <button className="text-xs sm:text-sm rounded-full px-3 sm:px-5 py-1.5 sm:py-2 font-semibold transition-all duration-200 text-black bg-yellow-300 whitespace-nowrap md:text-black">
                  Sign Up
                </button>
              </Link>

              <button
                onClick={() => setOpen(true)}
                className="ml-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-[9px] shadow-sm transition-all duration-200 hover:bg-slate-50 md:border-white/20 md:bg-white/10 md:hover:bg-white/20"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5 text-slate-700 md:text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
