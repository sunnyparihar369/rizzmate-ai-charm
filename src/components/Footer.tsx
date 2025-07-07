const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">💕</div>
              <span className="text-xl font-bold text-gradient">RizzMate</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Your AI wingman for dating apps. Turn every conversation into a potential connection with perfectly crafted replies.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="text-2xl hover:scale-110 transition-bounce cursor-pointer">📧</div>
              <div className="text-2xl hover:scale-110 transition-bounce cursor-pointer">🐦</div>
              <div className="text-2xl hover:scale-110 transition-bounce cursor-pointer">📘</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Screenshot Upload</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">AI Analysis</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Tone Selection</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy First</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 RizzMate. All rights reserved. Made with 💕 for better connections.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;