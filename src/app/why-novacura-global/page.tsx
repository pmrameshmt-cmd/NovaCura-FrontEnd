import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { ShieldCheck, Users, Globe, Smartphone, HeartHandshake, Banknote } from 'lucide-react';

const reasons = [
    {
        icon: ShieldCheck,
        title: 'Access to top hospitals across India, Turkey and Bulgaria',
        description: 'We partner with JCI-accredited hospitals and world-renowned specialists.',
    },
    {
        icon: Users,
        title: 'Personalised care coordinators',
        description: 'A dedicated case manager accompanies you throughout your journey.',
    },
    {
        icon: Globe,
        title: 'End-to-end travel support',
        description: 'From visa assistance to airport pickups and accommodation.',
    },
    {
        icon: Smartphone,
        title: 'Digital consultations',
        description: 'Consult with doctors via video call before you travel.',
    },
    {
        icon: Banknote,
        title: 'Affordable treatment options',
        description: 'World-class care at a fraction of the cost in Western countries.',
    },
    {
        icon: HeartHandshake,
        title: '24/7 assistance',
        description: 'We are always here for you, anytime, anywhere.',
    },
];

export default function WhyNovacuraGlobalPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans mt-10">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Why Choose NOVACURA GLOBAL
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            Why Patients Trust NOVACURA GLOBAL
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reasons.map((reason, index) => (
                                <div key={index} className="flex flex-col items-start p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                                        <reason.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                                    <p className="text-muted-foreground">{reason.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
