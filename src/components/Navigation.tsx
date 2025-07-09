import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple admin check for Clerk
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress === 'classroom2cash@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-2xl">💕</div>
            <span className="text-xl font-bold text-gradient">RizzMate</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {location.pathname === '/' ? (
              <>
                <a 
                  href="#features" 
                  className="text-foreground hover:text-primary transition-smooth cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-foreground hover:text-primary transition-smooth cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  How It Works
                </a>
                <a 
                  href="#pricing" 
                  className="text-foreground hover:text-primary transition-smooth cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Pricing
                </a>
              </>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            )}
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </SignInButton>
              <Button 
                variant="romantic" 
                size="sm"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </SignedOut>
            <SignedIn>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                >
                  Admin Panel
                </Button>
              )}
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;