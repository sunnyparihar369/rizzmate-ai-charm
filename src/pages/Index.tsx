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

  // Use credits hook to trigger profile creation immediately when user signs in
  const { credits, loading } = useCredits();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      console.log(`Checking admin status for user: ${user.primaryEmailAddress?.emailAddress}`);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, email')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.log('Profile not found or error:', error);
          // If profile doesn't exist yet, wait a bit and try again
          if (error.code === 'PGRST116') {
            console.log('Profile not found, will retry in 2 seconds...');
            setTimeout(() => checkAdminStatus(), 2000);
          }
          return;
        }

        console.log('Profile found:', data);
        const adminStatus = data?.is_admin || false;
        setIsAdmin(adminStatus);
        console.log(`Admin status set to: ${adminStatus}`);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [user, credits]); // Add credits as dependency to recheck when profile is created

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
