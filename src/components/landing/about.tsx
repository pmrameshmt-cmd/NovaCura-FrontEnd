import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function About() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');
    return (
        <section id="about" className="py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-96 w-full rounded-2xl shadow-2xl overflow-hidden lg:h-[500px]">
                        {aboutImage && (
                            <Image
                                src={aboutImage.imageUrl}
                                alt={aboutImage.description}
                                fill
                                className="object-cover"
                                data-ai-hint={aboutImage.imageHint}
                            />
                        )}
                    </div>
                    <div>
                        <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
                            Pioneering a New Era of Personalised Healthcare
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-foreground/80">
                            NOVACURA GLOBAL was founded on the principle that healthcare should be as unique as the individual. We believe in a proactive, Personalised, and privileged approach to wellness, providing our discerning clientele with frictionless access to the very best medical care the world has to offer.
                        </p>
                        <p className="mt-4 text-lg leading-8 text-foreground/80">
                            Our mission is to remove every barrier between you and optimal health, handling every complexity with sophistication and unwavering attention to detail, so you can focus solely on your well-being.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
