import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">💕</div>
            <span className="text-xl font-bold text-gradient">RizzMate</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-smooth">
              How It Works
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-smooth">
              Pricing
            </a>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </SignInButton>
              <Button variant="romantic" size="sm">
                Get Started
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="romantic" size="sm">
                Dashboard
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;