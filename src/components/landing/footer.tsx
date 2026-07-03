"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Stethoscope, Phone, Mail } from "lucide-react";
import { Suspense } from "react";

export default function Footer() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
}

function FooterContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const isHospitalPage = pathname.startsWith("/hospitals");

  const isAyurvedicHospitalPage = pathname
    .toLowerCase()
    .includes("/hospitals/ayurvedicnew");
  // Matches /hospitals/Detoxnew (case-insensitive) and/or the buchinger-wilhelmi slug
  const slug = searchParams?.get("slug") || "";
  const isDetoxHospitalPage =
    pathname.toLowerCase().includes("/hospitals/Detoxnew") ||
    slug.toLowerCase() === "buchinger-wilhelmi";

  const getHref = (href: string) => {
    if (href.startsWith("#") && !isHome) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start md:col-span-2">
            <Link href="/" className="flex items-center gap-3 select-none ">
              <img
                src="/images/Nova%20Cura%20Global%20Logo.png"
                alt="NovaCura Global Logo"
                className="h-20 w-48 object-contain "
              />
            </Link>
            <p className="mt-4 text-foreground/70 max-w-sm">
              Your premier partner in global health and wellness, providing
              discreet and luxurious medical concierge services.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:col-span-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Navigate
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/who-we-are"
                    className="text-base text-foreground/80 hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={getHref("#services")}
                    className="text-base text-foreground/80 hover:text-foreground"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-base text-foreground/80 hover:text-foreground"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href={getHref("#hospitals")}
                    className="text-base text-foreground/80 hover:text-foreground"
                  >
                    Hospitals
                  </Link>
                </li>
                <li>
                  <Link
                    href={getHref("#contact")}
                    className="text-base text-foreground/80 hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Contact
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <a
                    href="mailto:info@novacuraglobal.com"
                    className="text-sm text-foreground/80 hover:text-primary transition-colors break-all"
                  >
                    info@novacuraglobal.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  {isAyurvedicHospitalPage ? (
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <a
                        href="tel:+447779729669"
                        className="text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        +44 7779 729669
                      </a>
                    </div>
                  ) : isDetoxHospitalPage ? (
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <a
                        href="tel:+447776186116"
                        className="text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        +44 7779 729669
                      </a>
                    </div>
                  ) : isHospitalPage ? (
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <a
                          href="tel:+447779729669"
                          className="text-sm text-foreground/80 hover:text-primary transition-colors"
                        >
                          +44 7779 729669
                        </a>

                        <a
                          href="tel:08503026140"
                          className="text-sm text-foreground/80 hover:text-primary transition-colors"
                        >
                          +90 850 302 6140
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <a
                        href="tel:+447776186116"
                        className="text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        +44 7776 186116
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  {isAyurvedicHospitalPage ? null : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                      {isDetoxHospitalPage ? (
                        <div className="text-sm text-foreground/80 leading-relaxed">
                          <p className="font-medium text-foreground">GERMANY</p>
                          <p>Wilhelm-Beck-Str. 27</p>
                          <p>88662 Überlingen</p>
                          <p>Germany</p>
                        </div>
                      ) : isHospitalPage ? (
                        <div className="text-sm text-foreground/80 leading-relaxed">
                          <p className="font-medium text-foreground">TURKEY</p>
                          <p>Fener Mah. 1950 Sk. Casaline A2</p>
                          <p>{"Girişi No: 1/2 İç Kapı No: 108"}</p>
                          <p>{"Muratpaşa / Antalya, Turkey"}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-foreground/80 leading-relaxed">
                          <p className="font-medium text-foreground">
                            NOVA CURA GLOBAL
                          </p>
                          <p>Unity Place</p>
                          <p>200 Grafton Gate</p>
                          <p>Milton Keynes</p>
                          <p>MK9 1UP</p>
                          <p>United Kingdom</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-3 text-center text-sm text-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} NOVACURA GLOBAL. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
