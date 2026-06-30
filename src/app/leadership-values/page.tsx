import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import LeaderProfile from '@/components/leadership/leader-profile';
import CareModel from '@/components/values/care-model';

export default function LeadershipValuesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Leadership & Values
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            Guided by experienced leaders and a commitment to compassionate care.
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="">
                        <div className="mb-20">
                            <h2 className="text-3xl font-bold font-headline mb-10 text-center">Our Leadership</h2>
                            <LeaderProfile />
                        </div>

                        <div>
                            <CareModel />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
