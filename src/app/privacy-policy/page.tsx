import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            Your privacy and discretion are our highest priorities.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 prose max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                        <p className="mb-6">At NOVACURA GLOBAL, we are committed to protecting your personal and medical information. This Privacy Policy outlines how we collect, use, and safeguard your data.</p>
                        
                        <h2 className="text-2xl font-bold mb-4">Information Collection</h2>
                        <p className="mb-6">We collect information necessary to provide our medical concierge services, including personal details and medical history provided through our secure portal.</p>
                        
                        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                        <p className="mb-6">We implement the highest standards of security to ensure your data remains confidential and is only used for intended healthcare coordination.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
