import React from 'react';

const careItems = [
    {
        letter: 'C',
        title: 'Compassion',
        description: 'We treat every patient like family.',
    },
    {
        letter: 'A',
        title: 'Assurance',
        description: 'Transparent pricing and clear guidance.',
    },
    {
        letter: 'R',
        title: 'Reliability',
        description: 'End-to-end support, always available.',
    },
    {
        letter: 'E',
        title: 'Excellence',
        description: 'Partnering with top doctors and hospitals.',
    },
];

export default function CareModel() {
    return (
        <div className="w-full py-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-12">
                The CARE Model
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {careItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                            <span className="text-4xl font-bold text-primary group-hover:text-white transition-colors duration-300 font-headline">
                                {item.letter}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-[200px]">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
