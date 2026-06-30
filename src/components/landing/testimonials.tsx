import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: 'Alistair Worthington',
    title: 'CEO, Global Ventures Inc.',
    image: PlaceHolderImages.find(p => p.id === 'testimonial-avatar-1'),
    quote: "NOVACURA GLOBAL's attention to detail is simply unmatched. They handled everything with such professionalism and discretion. My health has never been in better hands.",
  },
  {
    name: 'Isabella Dubois',
    title: 'Philanthropist & Art Collector',
    image: PlaceHolderImages.find(p => p.id === 'testimonial-avatar-2'),
    quote: 'The peace of mind that comes with their service is priceless. From finding the right specialist to managing my recovery, the experience was seamless and truly luxurious.',
  },
  {
    name: 'Kian Al-Jamil',
    title: 'International Royalty',
    image: PlaceHolderImages.find(p => p.id === 'testimonial-avatar-3'),
    quote: 'I require the best, and NOVACURA GLOBAL delivers. Their global network and immediate response time are critical for my lifestyle. I trust them implicitly with my family\'s health.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            Words of Trust
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Hear from our distinguished clientele about their experiences with our unparalleled medical concierge services.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto mt-16"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <p className="text-foreground/80 italic">"{testimonial.quote}"</p>
                      <div className="mt-6 flex items-center gap-4">
                        {testimonial.image && (
                           <Avatar>
                           <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.image.imageHint} />
                           <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                        )}
                        <div>
                          <p className="font-bold text-primary">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
