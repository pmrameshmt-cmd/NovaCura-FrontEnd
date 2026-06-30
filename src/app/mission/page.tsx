import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function MissionPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Our Mission
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            To make global healthcare accessible, transparent, and patient-centric by guiding individuals through every step of their medical journey.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            We are committed to removing barriers to quality healthcare, ensuring that distance is never an obstacle to receiving the best possible treatment.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
