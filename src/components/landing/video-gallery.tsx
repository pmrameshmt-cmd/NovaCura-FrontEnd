import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const videos = [
  {
    id: "video-thumb-1",
    title: "Advanced Surgical Suites",
  },
  {
    id: "video-thumb-2",
    title: "Comfort & Recovery",
  },
  {
    id: "video-thumb-3",
    title: "Travel & Accommodation",
  },
];

export default function VideoGallery() {
  return (
    <section id="video-gallery" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            A Glimpse Into Excellence
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Explore our partner facilities and witness the environment where
            your health journey will unfold.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const image = PlaceHolderImages.find((p) => p.id === video.id);
            return (
              <Card
                key={video.id}
                className="overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl group"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    </div>
                  </div>
                  <div className="p-4 bg-card">
                    <h3 className="font-headline text-xl font-bold text-primary">
                      {video.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
