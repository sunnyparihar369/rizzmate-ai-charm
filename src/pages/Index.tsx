import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
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

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
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
