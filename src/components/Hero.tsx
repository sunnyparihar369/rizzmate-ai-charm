import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 hero-gradient animate-glow" />
      
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-6xl animate-float">💕</div>
      <div className="absolute top-40 right-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>💬</div>
      <div className="absolute bottom-40 left-20 text-5xl animate-float" style={{ animationDelay: '2s' }}>✨</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp">
            Meet Your AI
            <span className="block text-gradient text-6xl md:text-8xl">
              Wingman
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Turn awkward conversations into magnetic connections with AI-powered replies that actually work
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90">
              📸 Upload Screenshots
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90">
              🤖 AI-Powered Replies
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90">
              💎 Irresistible Charm
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button variant="hero" size="xl" className="text-lg">
              Start Charming Now ✨
            </Button>
            <Button variant="soft" size="xl" className="text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              See How It Works
            </Button>
          </div>
          
          {/* Social proof */}
          <p className="text-white/70 mt-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Join 10,000+ users getting more matches every day
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;