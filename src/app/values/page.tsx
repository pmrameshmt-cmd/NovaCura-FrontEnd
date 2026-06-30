import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import CareModel from '@/components/values/care-model';

export default function ValuesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col text-left">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8">
                            Our Core Values
                        </h1>
                        <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                            At NOVACURA GLOBAL, our values are the compass that guides every decision and interaction. We believe in healthcare that is not just effective, but also empathetic, transparent, and built on a foundation of unwavering integrity.
                        </p>
                    </div>
                </section>

                <section className="bg-background text-foreground py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <CareModel />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
