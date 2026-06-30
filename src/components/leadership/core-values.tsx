import React from 'react';
import { Handshake, Eye, ShieldCheck, Lightbulb, Globe } from 'lucide-react';

const values = [
    {
        icon: Handshake,
        title: 'Compassion',
        description: 'Empathy & Patient-Centered Care',
    },
    {
        icon: Eye,
        title: 'Transparency',
        description: 'Clear Communication & Guidance',
    },
    {
        icon: ShieldCheck,
        title: 'Reliability',
        description: 'Consistent 24/7 Dedicated Support',
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'Pioneering Seamless Healthcare',
    },
    {
        icon: Globe,
        title: 'Integrity',
        description: 'Ethics & Global Standards',
    },
];

export default function CoreValues() {
    return (
        <div className="w-full py-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-10">
                Core leadership values at NOVACURA GLOBAL
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
                {values.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                        <div className="p-3">
                            <value.icon className="w-12 h-12" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                            <p className="text-sm opacity-90 max-w-[150px] mx-auto leading-tight">
                                {value.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center mt-12 text-sm opacity-80">
                These core beliefs are the foundation of leadership at NOVACURA GLOBAL
            </p>
        </div>
    );
}
