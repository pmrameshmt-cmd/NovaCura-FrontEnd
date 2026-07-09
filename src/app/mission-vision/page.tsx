import React from "react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Target, Telescope } from "lucide-react";

export default function MissionVisionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-open-sans mt-10">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
              Our Mission & Vision
            </h1>
            <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
              Driving the future of global healthcare with purpose and
              foresight.
            </p>
          </div>
        </section>
        <div className="text-xl  text-center font-serif   text-muted-foreground mt-20 text-primary">
         "Healthcare doesn’t end with treatment. It begins with recovery"
        </div>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
              {/* Mission */}
              <div className="flex flex-col p-8 border rounded-2xl shadow-sm hover:shadow-md transition-all bg-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold font-headline">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  To redefine global healthcare by seamlessly integrating
                  world-class medical treatment, holistic healing, recovery, and
                  lifelong wellness through a trusted international network of
                  healthcare partners.{" "}
                </p>
                {/* <p className="text-base text-muted-foreground mt-auto">
                                    We are committed to removing barriers to quality healthcare, ensuring that distance is never an obstacle to receiving the best possible treatment.
                                </p> */}
              </div>

              {/* Vision */}
              <div className="flex flex-col p-8 border rounded-2xl shadow-sm hover:shadow-md transition-all bg-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Telescope className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold font-headline">
                    Our Vision
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  To connect patients with the world’s most trusted healthcare
                  providers while delivering personalised care coordination,
                  evidence-based treatment pathways, integrative wellness
                  solutions, and compassionate after-care that improves lives
                  beyond the hospital.{" "}
                </p>
                {/* <p className="text-base text-muted-foreground mt-auto">
                                    We envision a world where every patient has access to the Specialised care they need, delivered with compassion and integrity.
                                </p> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
