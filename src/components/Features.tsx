import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: "📸",
      title: "Screenshot Magic",
      description: "Upload any dating app conversation screenshot and let our AI analyze the vibe instantly"
    },
    {
      icon: "🧠",
      title: "Smart AI Analysis", 
      description: "Advanced AI reads between the lines to understand context, personality, and conversation flow"
    },
    {
      icon: "💬",
      title: "Perfect Replies",
      description: "Get witty, flirty, and engaging responses that match your personality and their energy"
    },
    {
      icon: "🎯",
      title: "Tone Selection",
      description: "Choose from Flirty, Funny, or Casual tones to match your mood and conversation style"
    },
    {
      icon: "⚡",
      title: "Instant Results",
      description: "Get your perfect reply in seconds - no more staring at your screen wondering what to say"
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your conversations stay private. We process everything securely and never store your data"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Why RizzMate Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining cutting-edge AI with dating psychology to give you the unfair advantage in online dating
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-romantic transition-smooth group cursor-pointer border-border/50 hover:border-primary/30"
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4 group-hover:animate-float">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-smooth">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;