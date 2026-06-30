import React from 'react';
import { Play } from 'lucide-react';

export default function LeadershipVideo() {
    return (
        <div className="w-full py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold font-headline mb-8">
                    See NOVACURA GLOBAL in Action
                </h2>
                <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black group cursor-pointer">
                    {/* Placeholder Image or Video */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 group-hover:bg-gray-800 transition-colors">
                        {/* Simulated Video Player */}
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/LXb3EKWsInQ?si=Kq2l_1d-Jp3Z1x0_"
                            title="NOVACURA GLOBAL Demo Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </div>
                <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
                    Discover how our leadership and values translate into exceptional patient care.
                </p>
            </div>
        </div>
    );
}
