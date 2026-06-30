import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { Globe, Hospital, Smile, Calendar } from 'lucide-react';

const stats = [
    {
        icon: Globe,
        value: '20+',
        label: 'Patients from countries',
    },
    {
        icon: Hospital,
        value: '50+', // Example value, prompt said "Partner hospitals across India"
        label: 'Partner hospitals across India',
    },
    {
        icon: Smile,
        value: '98%', // Example value
        label: 'High patient satisfaction rate',
    },
    {
        icon: Calendar,
        value: '500+', // Example value, prompt said "Hundreds"
        label: 'Successful treatments coordinated',
    },
];

export default function ImpactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Our Impact
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            Our Growing Global Impact
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
                                    <div className="p-4 bg-primary/10 rounded-full mb-6">
                                        <stat.icon className="w-10 h-10 text-primary" />
                                    </div>
                                    <span className="text-4xl font-bold text-foreground mb-2 font-headline">
                                        {stat.value}
                                    </span>
                                    <p className="text-muted-foreground font-medium">{stat.label}</p>
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
