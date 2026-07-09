import Contact from '@/components/landing/contact';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import Services from '@/components/landing/services';
import WhyChooseUs from '@/components/landing/why-choose-us';
import About from '@/components/landing/about';
import Stats from '@/components/landing/stats';
import Hospitals from '@/components/landing/hospitals';
import AyurvedicHospitals from '@/components/landing/ayurvedic-hospitals';
import VideoGallery from '@/components/landing/video-gallery';
import Detox from "../components/landing/Detox";
import AyurvedicNew from "../components/landing/ayurvedic";  
import Testimonials from '@/components/landing/testimonials';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background ">
      <Header />
      <main className="flex-1 py-30 md:py-0 ">
        <Hero />
        <Services />
        <Hospitals />
        <AyurvedicNew />
        <Detox />
        {/* <AyurvedicHospitals /> */}
        <About />
        <Stats />
        <VideoGallery />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
