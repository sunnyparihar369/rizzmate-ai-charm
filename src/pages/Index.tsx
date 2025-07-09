import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import RizzMateApp from "@/components/RizzMateApp";
import Admin from "./Admin";

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  // Use credits hook to ensure profile exists
  const { credits, loading } = useCredits();

  // Simple admin check
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress === 'classroom2cash@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Listen for admin panel show event
  useEffect(() => {
    const handleShowAdmin = () => setShowAdmin(true);
    window.addEventListener('showAdmin', handleShowAdmin);
    return () => window.removeEventListener('showAdmin', handleShowAdmin);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <SignedOut>
        {!showApp ? (
          <>
            <Hero onStartCharming={() => setShowApp(true)} />
            <Features />
            <HowItWorks />
            <Pricing />
            <CTA />
            <Footer />
          </>
        ) : (
          <RizzMateApp />
        )}
      </SignedOut>
      <SignedIn>
        {showAdmin && isAdmin ? (
          <div className="pt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <button 
                  onClick={() => setShowAdmin(false)}
                  className="text-primary hover:text-primary/80"
                >
                  Back to App
                </button>
              </div>
            </div>
            <Admin />
          </div>
        ) : !showApp ? (
          <>
            <Hero onStartCharming={() => setShowApp(true)} />
            <Features />
            <HowItWorks />
            <Pricing />
            <CTA />
            <Footer />
          </>
        ) : (
          <RizzMateApp />
        )}
      </SignedIn>
    </div>
  );
};

export default Index;
