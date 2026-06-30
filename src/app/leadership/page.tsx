import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import CoreValues from '@/components/leadership/core-values';
import LeaderProfile from '@/components/leadership/leader-profile';
import LeadershipCards from './leadership-cards';


export default function LeadershipPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col text-left">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8">
                            Leadership at NOVACURA GLOBAL
                        </h1>
                        <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                            NOVACURA GLOBAL is a healthcare concierge platform driven by compassion and excellence. Powered by experienced medical professionals and dedicated support teams, we are committed to making world-class healthcare accessible, seamless, and Personalised for international patients seeking treatment in India.
                        </p>
                    </div>
                </section>

                <section className="bg-background text-foreground py-12">
                    <div className="">
                        <CoreValues />
                        <LeadershipCards />
                        {/* <LeaderProfile /> */}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
