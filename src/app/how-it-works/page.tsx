import React from 'react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { ClipboardList, UserPlus, FileText, Plane, Activity, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: ClipboardList,
        title: 'Share your medical needs',
        description: 'Provide us with your medical history and requirements.',
    },
    {
        icon: UserPlus,
        title: 'Connect with expert doctors',
        description: 'We match you with top specialists in India.',
    },
    {
        icon: FileText,
        title: 'Receive treatment plans',
        description: 'Get a detailed plan and cost estimate.',
    },
    {
        icon: Plane,
        title: 'Travel & accommodation arranged',
        description: 'We handle your visa, flights, and stay.',
    },
    {
        icon: Activity,
        title: 'Treatment & recovery support',
        description: 'Personalised care during your procedure.',
    },
    {
        icon: CheckCircle,
        title: 'Post-care follow-ups',
        description: 'Continued support after you return home.',
    },
];

export default function HowItWorksPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-open-sans">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            How NOVACURA GLOBAL Works
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                            Your Journey With NOVACURA GLOBAL
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold mb-4">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
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
