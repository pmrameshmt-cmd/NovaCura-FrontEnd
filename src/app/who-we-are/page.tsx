import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function WhoWeArePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Who We Are
                        </h1>
                        <p className="text-lg md:text-xl max-w-4xl leading-relaxed opacity-90">
                            NOVACURA GLOBAL is a medical tourism and healthcare concierge platform dedicated to helping international patients access world-class treatment in India, Turkey and Bulgaria. We combine medical expertise, travel coordination, and Personalised support to ensure every patient experiences a stress-free healing journey.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            We believe quality healthcare should have no borders. Our team works hard to connect patients with the best medical care available in India, Turkey and Bulgaria.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
