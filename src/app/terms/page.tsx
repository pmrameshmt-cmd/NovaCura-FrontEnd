import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            The terms and conditions for our medical concierge excellence.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 prose max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                        <p className="mb-6">By accessing or using NOVACURA GLOBAL's services, you agree to be bound by these Terms of Service.</p>
                        
                        <h2 className="text-2xl font-bold mb-4">2. Medical Concierge Services</h2>
                        <p className="mb-6">NOVACURA GLOBAL provides facilitation and coordination services for medical care. We are not a medical provider ourselves but connect you with top specialists.</p>
                        
                        <h2 className="text-2xl font-bold mb-4">3. Confidentiality</h2>
                        <p className="mb-6">All client relationships are treated with the utmost discretion as part of our bespoke service commitment.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
