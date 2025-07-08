import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import RizzMateApp from "@/components/RizzMateApp";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SignedOut>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
        <Footer />
      </SignedOut>
      <SignedIn>
        <RizzMateApp />
      </SignedIn>
    </div>
  );
};

export default Index;
