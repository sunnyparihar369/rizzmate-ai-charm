import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-30">💕</div>
      <div className="absolute top-20 right-20 text-3xl animate-float opacity-30" style={{ animationDelay: '1s' }}>💬</div>
      <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-30" style={{ animationDelay: '2s' }}>✨</div>
      <div className="absolute bottom-10 right-10 text-3xl animate-float opacity-30" style={{ animationDelay: '3s' }}>🔥</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Never Run Out of
            <span className="block text-5xl md:text-7xl">
              Perfect Replies?
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who've transformed their dating game with AI-powered charm
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="hero" 
              size="xl" 
              className="text-lg bg-white text-primary hover:bg-white/90"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Your Free Trial ✨
            </Button>
            <Button 
              variant="soft" 
              size="xl" 
              className="text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Watch Demo Video
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Free 7-day trial
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;